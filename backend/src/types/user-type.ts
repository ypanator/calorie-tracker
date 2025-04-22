import { z } from "zod";
import { Model } from "sequelize";
import userSchema from "../schemas/user-schema";
import { Exercise } from "./exercise-type";
import { Food } from "./food-type";

export type User = z.infer<typeof userSchema> & { id?: number };

export type UserModel = Model<User>;

export type UserFull = User & { exercises: Exercise[], foods: Food[] };