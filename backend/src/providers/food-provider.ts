import { DataTypes, ModelStatic } from "sequelize";
import { SequelizeData } from "../db/db";
import { Food, FoodModel } from "../types/food-type";
import ApiError from "../error/api-error";
import axios, { AxiosResponse } from "axios";

export default class FoodProvider {

    foodModelStatic: ModelStatic<FoodModel>;

    constructor(private sequelizeData: SequelizeData) {
        this.foodModelStatic = sequelizeData.define("Food", {
            name: {
                type: DataTypes.STRING,
                validate: { len: [1, 100] }
            },
            calories: {
                type: DataTypes.NUMBER,
                validate: { min: 1 }
            },
            count: {
                type: DataTypes.NUMBER,
                validate: { min: 1 }
            },
        });
    };

    async find(query: string, amount: number): Promise<Food> {
        const apiKey = process.env.food_api_key || null;
        if (!apiKey) {
            console.log("Missing foods api key.");
            throw new ApiError("Searching for food is not available.", 500);
        }
        const apiID = process.env.food_api_id || null;
        if (!apiID) {
            console.log("Missing foods api id.");
            throw new ApiError("Searching for food is not available.", 500);
        }

        const options = {
            'method': 'POST',
            'url': 'https://trackapi.nutritionix.com/v2/natural/nutrients',
            'headers': {
              'Content-Type': 'application/json',
              'x-app-id': apiID,
              'x-app-key': apiKey
            },
            body: JSON.stringify({
                "query": query,
                "num_servings": amount
            })
        };

        let response: AxiosResponse<any, any>;
        try {
            response = await axios.request(options);
        } catch (e) {
            console.log(`Error on calling the food api. ${(e as Error).stack}`);
            throw new ApiError("Searching for foods is not available.", 500);
        }

        const item = response.data["foods"][0]
        return {
            name: item["food_name"],
            calories: item["nf_calories"],
            count: item["serving_qty"]
        }        
    };

    add(food: Food): Promise<FoodModel> {
        return this.foodModelStatic.create(food, { validate: true });
    };
}