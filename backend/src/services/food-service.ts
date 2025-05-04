import FoodProvider from "../providers/food-provider.js";
import { Food, FoodModel } from "../types/food-type.js";

/**
 * Service class handling food-related business logic
 */
export default class FoodService {
    constructor(private foodProvider: FoodProvider) {}

    /**
     * Adds a new food item to the database
     * @param food The food item to add
     * @returns Promise resolving to the created food model
     */
    add(food: Food): Promise<FoodModel> {
        return this.foodProvider.add(food);
    }
    
    /**
     * Finds food items matching the given query
     * @param query The search query string
     * @param amount The amount of the food item
     * @returns Promise resolving to an array of matching food items
     */
    find(query: string, amount: number): Promise<Food[]> {
        return this.foodProvider.find(query, amount);
    }
}