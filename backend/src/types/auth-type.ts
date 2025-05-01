import { z } from "zod";
import { Model } from "sequelize";
import authSchema from "../schemas/auth-schema.js";
import { UserModel } from "./user-type.js";

export type Auth = z.infer<typeof authSchema> & { id?: number, userId?: number };

export type AuthModel = Model<Auth>;