import FoodProvider from "../providers/food-provider";
import { Food } from "../types/food-type";

export default class FoodService {

    constructor(private foodProvider: FoodProvider) {}

    add(food: Food) {
        throw new Error("Method not implemented.");
    }
    find(query: string) {
        throw new Error("Method not implemented.");
    }

}