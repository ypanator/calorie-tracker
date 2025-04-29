import { z } from "zod";
import { Model } from "sequelize";
import foodSchema from "../schemas/food-schema";

export type Food = z.infer<typeof foodSchema> & { id?: number, userId?: number };

export type FoodModel = Model<Food>;