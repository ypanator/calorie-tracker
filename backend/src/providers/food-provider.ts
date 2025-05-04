import { DataTypes, ModelStatic } from "sequelize";
import { SequelizeData } from "../db/db.js";
import { Food, FoodModel } from "../types/food-type.js";
import ApiError from "../error/api-error.js";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import UserProvider from "./user-provider.js";

/** Food data and Nutritionix API provider */
export default class FoodProvider {
    foodModelStatic: ModelStatic<FoodModel>;
    foodAxios: AxiosInstance;

    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.foodModelStatic = sequelizeData.define("food", {
            name: {
                type: DataTypes.STRING,
                validate: { len: [1, 100] }
            },
            calories: {
                type: DataTypes.INTEGER,
                validate: { min: 1 }
            },
            count: {
                type: DataTypes.INTEGER,
                validate: { min: 1 }
            },
            unit: {
                type: DataTypes.STRING,
                validate: { len: [1, 100] }               
            }
        });

        this.foodModelStatic.belongsTo(userProvider.userModelStatic, { foreignKey: "userId" });

        this.foodAxios = axios.create();
        axiosRetry(this.foodAxios, {
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
        });
    };

        async find(query: string, amount: number): Promise<Food[]> {
        const apiKey = process.env.food_api_key || null;
        if (!apiKey) {
            console.log("Missing foods api key.");
            throw new ApiError("Searching for foods is not available.", 500);
        }
        const apiId = process.env.food_api_id || null;
        if (!apiId) {
            console.log("Missing foods api id.");
            throw new ApiError("Searching for foods is not available.", 500);
        }

        const items = await this.getItems(query, amount, apiKey, apiId);
        const commonResult = await this.getCommonDetailed(items.common, amount, apiKey, apiId);
        const brandedResult = await this.getBrandedDetailed(items.branded, amount, apiKey, apiId)
        return commonResult.concat(brandedResult);
    }

    /** Get initial search results from API */
    private async getItems(query: string, amount: number, apiKey: string, apiId: string): Promise<{
        common: (Food & { searchId: string })[], branded: (Food & { searchId: string })[]
    }> {
        const options = {
            'method': 'GET',
            'url': `https://trackapi.nutritionix.com/v2/search/instant/?query=${query}`,
            'headers': {
                'Content-Type': 'application/json',
                'x-app-id': apiId,
                'x-app-key': apiKey
            }
        };

        let response;
        try {
            response = await this.foodAxios.request(options);
        } catch (e) {
            console.log(`Error on calling the food api. ${(e as Error).stack}`);
            throw new ApiError("Searching for foods is not available.", 500);
        }

        const common = response.data["common"];
        const branded = response.data["branded"];
        const commonResult: (Food & { searchId: string })[] = [];
        const brandedResult: (Food & { searchId: string })[] = [];

        for (let i = 0; i < Math.min(common.length, 3); i++) {
            commonResult.push({
                searchId: common[i]["food_name"],
                name: common[i]["food_name"],
                calories: -1, // placeholder value, to be filled by getCommonDetailed
                count: amount,
                unit: common[i]["serving_unit"]
            });
        };

        for (let i = 0; i < Math.min(branded.length, 5 - commonResult.length); i++) {
            brandedResult.push({
                searchId: branded[i]["nix_item_id"],
                name: branded[i]["food_name"],
                calories: -1, // placeholder value, to be filled by getBrandedDetailed
                count: amount,
                unit: branded[i]["serving_unit"]
            });
        };

        return {common: commonResult, branded: brandedResult}
    }

    /** Get details for branded foods */
    private async getBrandedDetailed(items: (Food & { searchId: string })[], amount: number, apiKey: string, apiId: string): Promise<Food[]> {
        if (items.length === 0) return [];

        const tasks = items.map((item) => {
            const options = {
                method: 'GET',
                url: `https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${item.searchId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': apiId,
                    'x-app-key': apiKey
                }
            };
        
            return this.foodAxios.request(options)
                .then((response) => ({
                    name: item.name,
                    calories: Math.round(response.data["foods"][0]["nf_calories"] * amount),
                    count: amount,
                    unit: item.unit
                }))
                .catch((e) => {
                    console.log(`Error on calling the food api. ${(e as Error).stack}`);
                    throw new ApiError("Searching for foods is not available.", 500);
                });
        });

        return Promise.all(tasks);
    }

    /** Get details for common foods */
    private async getCommonDetailed(items: (Food & { searchId: string })[], amount: number, apiKey: string, apiId: string): Promise<Food[]> {
        if (items.length === 0) return [];

        const tasks = items.map((item) => {
            const options = {
                method: 'POST',
                url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': apiId,
                    'x-app-key': apiKey
                },
                data: {
                    query: item.searchId,
                    num_servings: 1  // Get calories for 1 serving, we'll multiply later
                }
            };
        
            return this.foodAxios.request(options)
                .then((response) => ({
                    name: item.name,
                    calories: Math.round(response.data["foods"][0]["nf_calories"] * amount),  // Multiply by amount like we do for branded foods
                    count: amount,
                    unit: item.unit
                }))
                .catch((e) => {
                    console.log(`Error on calling the food api. ${(e as Error).stack}`);
                    throw new ApiError("Searching for foods is not available.", 500);
                });
        });
        
        return Promise.all(tasks);
    }

    /** Add new food record */
    add(food: Food): Promise<FoodModel> {
        return this.foodModelStatic.create(food, { validate: true });
    }
};