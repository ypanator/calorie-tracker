import express, { Router } from "express"
import { z } from "zod";

import { ExerciseSchema } from "../schemas/exercise-schema";
import ExerciseService from "../services/exercise-service";
import ApiError from "../error-handler/api-error";

export default class ExerciseController {
    router: Router;

    constructor(exerciseService: ExerciseService) {
        this.router = express.Router();
        
        this.router.get("/find", async (req, res, next) => {
            try {
                let query: string = typeof req.query.name === "string" ? req.query.name : "";
                query = query.trim().replace(/[^a-zA-Z\s]/g, "");
        
                if (!query) {
                    throw new ApiError("Query must be a string and contain at least 1 letter.", 400);
                }
                res.status(200).json({ exercise: await exerciseService.find(query) });
        
            } catch (e) {
                next(e);
            }
        });
    };
};