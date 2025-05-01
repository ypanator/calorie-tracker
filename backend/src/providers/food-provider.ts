import { DataTypes, ModelStatic } from "sequelize";
import { SequelizeData } from "../db/db";
import { Food, FoodModel } from "../types/food-type";
import ApiError from "../error/api-error";
import axios, { AxiosResponse } from "axios";
import UserProvider from "./user-provider";

export default class FoodProvider {

    foodModelStatic: ModelStatic<FoodModel>;

    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.foodModelStatic = sequelizeData.define("Food", {
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

        this.foodModelStatic.belongsTo(userProvider.userModelStatic);
    };

    async find(query: string, amount: number): Promise<Food[]> {
        const apiKey = process.env.food_api_key || null;
        if (!apiKey) {
            console.log("Missing foods api key.");
            throw new ApiError("Searching for food is not available.", 500);
        }
        const apiId = process.env.food_api_id || null;
        if (!apiId) {
            console.log("Missing foods api id.");
            throw new ApiError("Searching for food is not available.", 500);
        }

        const items = await this.getItems(query, amount, apiKey, apiId);
        const commonResult = await this.getCommonDetailed(items.common, apiKey, apiId);
        const brandedResult = await this.getBrandedDetailed(items.branded, apiKey, apiId)
        return commonResult.concat(brandedResult);
    };

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

        let response: AxiosResponse<any, any>;
        try {
            response = await axios.request(options);
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
                calories: -1, // placeholder value, to be filled by this.getDetailed()
                count: amount,
                unit: common[i]["serving_unit"]
            });
        };

        for (let i = 0; i < Math.min(branded.length, 5 - commonResult.length); i++) {
            brandedResult.push({
                searchId: branded[i]["nix_item_id"],
                name: branded[i]["food_name"],
                calories: -1, // placeholder value, to be filled by this.getDetailed()
                count: amount,
                unit: branded[i]["serving_unit"]
            });
        };

        return {common: commonResult, branded: brandedResult}
    }

    private async getBrandedDetailed(items: (Food & { searchId: string })[], apiKey: string, apiId: string): Promise<Food[]> {

        const options = {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-app-id': apiId,
                'x-app-key': apiKey
            }
        };
        
        const tasks = items.map((item) => {
            return axios.request({
                ...options,
                url: `https://trackapi.nutritionix.com/v2/search/item/?upc=${item.searchId}`
            })
            .then((response) => ({
                name: item.name,
                calories: response.data["foods"][0]["nf_calories"] * item.count,
                count: item.count,
                unit: item.unit
            }))
            .catch((e) => {
                console.log(`Error on calling the food api. ${(e as Error).stack}`);
                throw new ApiError("Searching for foods is not available.", 500);
            });
        });

        const result: Food[] = await Promise.all(tasks);
        return result;
    }

    private async getCommonDetailed(items: (Food & { searchId: string })[], apiKey: string, apiId: string): Promise<Food[]> {

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
                    num_servings: item.count
                }
            };
        
            return axios.request(options)
                .then((response) => ({
                    name: item.name,
                    calories: response.data["foods"][0]["nf_calories"],
                    count: item.count,
                    unit: item.unit
                }))
                .catch((e) => {
                    console.log(`Error on calling the food api. ${(e as Error).stack}`);
                    throw new ApiError("Searching for foods is not available.", 500);
                });
        });
        
        const result: Food[] = await Promise.all(tasks);
        return result;
    }

    add(food: Food): Promise<FoodModel> {
        return this.foodModelStatic.create(food, { validate: true });
    };
}