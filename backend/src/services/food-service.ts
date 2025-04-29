import FoodProvider from "../providers/food-provider";
import { Food, FoodModel } from "../types/food-type";

export default class FoodService {

    constructor(private foodProvider: FoodProvider) {}

    add(food: Food): Promise<FoodModel> {
        return this.foodProvider.add(food);
    }
    find(query: string): Promise<Food[]> {
        return this.foodProvider.find(query);
    }

}