import { Food, FoodModel } from "../types/food-type";

export default class FoodProvider {
    find(query: string): Promise<Food[]> {
        throw new Error("Method not implemented.");
    }
    add(food: Food): Promise<FoodModel> {
        throw new Error("Method not implemented.");
    }

}