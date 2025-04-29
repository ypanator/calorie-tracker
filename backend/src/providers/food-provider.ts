import { DataTypes, ModelStatic } from "sequelize";
import { SequelizeData } from "../db/db";
import { Food, FoodModel } from "../types/food-type";

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

    find(query: string): Promise<Food[]> {
        throw new Error("Method not implemented.");
    };

    add(food: Food): Promise<FoodModel> {
        return this.foodModelStatic.create(food, { validate: true });
    };
}