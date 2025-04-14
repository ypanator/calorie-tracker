import express, { Router } from "express"
import { z } from "zod";

import { exerciseSchema } from "../schemas/exercise-schema";
import ExerciseService from "../services/exercise-service";

const exerciseRouter: Router = express.Router();
const exerciseService: ExerciseService = new ExerciseService()

exerciseRouter.post("/add", async (req, res) => {
    try {
        await exerciseService.add(exerciseSchema.parse(req.body));
        res.status(201).json("Exercise added.");

    // TODO: put to global err handler
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ error: e.errors});
        } else {
            res.status(500).json({ error: "Internal server error."});
        }
    }
})

exerciseRouter.get("/find", async (req, res) => {
    try {
        let query: string = typeof req.query.name === "string" ? req.query.name : "";
        query = query.trim().replace(/[^a-zA-Z\s]/g, "");

        if (!query) {
            res.status(400).json({ error: "Query must be a string and contain at least 1 letter."});
            return;
        }
        res.status(200).json({ exercise: await exerciseService.find(query) });

    } catch (e) {
        res.status(500).json({ error: "Internal server error." })
    }
})

export default exerciseRouter;