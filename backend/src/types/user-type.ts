import { z } from "zod";
import { Model } from "sequelize";
import userSchema from "../schemas/user-schema.js";
import { Exercise } from "./exercise-type.js";
import { Food } from "./food-type.js";

export type UserAttributes = z.infer<typeof userSchema> & { id?: number };

export type UserAttributesModel = Model<UserAttributes>;

export type UserApi = {
    bmi: string,
    calories: string,
    carbs: string,
    fiber: string,
    protein: string,
    fat: string
}

export type UserApiModel = Model<UserApi>;

export type User = UserAttributes & UserApi;

export type UserModel = Model<User>

export type UserProfile = User & { exercises: Exercise[], foods: Food[] };

export type UserProfileModel = Model<UserProfile>;