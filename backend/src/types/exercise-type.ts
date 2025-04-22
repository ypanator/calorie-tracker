import { z } from "zod";
import { Model } from "sequelize";
import exerciseSchema from "../schemas/exercise-schema";
import exerciseApiSchema from "../schemas/exercise-api-schema";

export type Exercise = z.infer<typeof exerciseSchema> & { id?: number, userId?: number };

export type ExerciseModel = Model<Exercise>;

export type ExerciseApi = z.infer<typeof exerciseApiSchema>;