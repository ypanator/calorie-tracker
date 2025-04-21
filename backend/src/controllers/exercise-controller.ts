import express, { Router } from "express"

import ExerciseService from "../services/exercise-service";
import exerciseSchema from "../schemas/exercise-schema";
import ApiError from "../error-handler/api-error";
import { ExerciseApi } from "../types/exercise-type";
import { requireAuth } from "../middleware/auth-middleware";

export default class ExerciseController {
    router: Router;

    constructor(exerciseService: ExerciseService) {
        this.router = express.Router();
        
        this.router.get("/find", requireAuth, async (req, res, next) => {
            try {
                let query: string = typeof req.query.name === "string" ? req.query.name : "";
                query = query.trim().replace(/[^a-zA-Z\s]/g, "");
        
                if (!query) {
                    throw new ApiError("Query must be a string and contain at least 1 letter.", 400);
                }

                const durationStr = req.query.duration;
                if (durationStr === undefined) {
                    throw new ApiError("Please provide duration of the exercise.", 400);
                }
                if (typeof durationStr !== "string") { 
                    throw new ApiError("Please provide duration as a string.", 400);
                }

                const durationInt: number = parseInt(durationStr);
                if (Number.isNaN(durationInt)) {
                    throw new ApiError("Please provide a valid duration value.", 400);
                }
                if (durationInt <= 0) {
                    throw new ApiError("Duration must be greater than 0.", 400);
                }

                const exercises: ExerciseApi = await exerciseService.find(req.session.userId!, query, durationInt);
                res.status(200).json({ exercises: exercises });
        
            } catch (e) { next(e); }
        });

        this.router.post("/add", requireAuth, async (req, res, next) => {
            try {
                await exerciseService.add({ ...exerciseSchema.parse(req.body), userId: req.session.userId! });
                res.status(201).json("Exercise added.");
        
            } catch (e) { next(e); }
        })
    };
};