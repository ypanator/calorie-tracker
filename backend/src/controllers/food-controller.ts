import express, { Router } from "express"
import FoodService from "../services/food-service";
import { requireAuth } from "../middleware/auth-middleware";
import ApiError from "../error/api-error";
import foodSchema from "../schemas/food-schema";

export default class FoodControler {
    router: Router;

    constructor(foodService: FoodService) {
        this.router = express.Router();

        this.router.get("/find", requireAuth, async (req, res, next) => {
            try {
                let query: string = typeof req.query.name === "string" ? req.query.name : "";
                query = query.trim().replace(/[^a-zA-Z\s]/g, "");
        
                if (!query) {
                    throw new ApiError("Name must be a string and contain at least 1 letter.", 400);
                }

                const amountStr = req.query.amount;
                if (amountStr === undefined) {
                    throw new ApiError("Please provide the amount of the food.", 400);
                }
                if (typeof amountStr !== "string") { 
                    throw new ApiError("Please provide the amount as a string.", 400);
                }

                const amountInt: number = parseInt(amountStr);
                if (Number.isNaN(amountInt)) {
                    throw new ApiError("Please provide a valid amount value.", 400);
                }
                if (amountInt <= 0) {
                    throw new ApiError("Amount must be greater than 0.", 400);
                }

                const food = await foodService.find(query, amountInt);
                res.status(200).json({ food: food })

            } catch (e) { next(e); }
        });

        this.router.post("/add", requireAuth, async (req, res, next) => {
            try {
                await foodService.add({ ...foodSchema.parse(req.body), userId: req.session.userId! })
            } catch (e) { next(e); }
        });
    }

};