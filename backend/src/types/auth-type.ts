import { z } from "zod";
import { Model } from "sequelize";
import authSchema from "../schemas/auth-schema";

export type Auth = z.infer<typeof authSchema> & { id?: number };

export type AuthModel = Model<Auth> & Auth;