/** @swagger
 * /food:
 *   tags: [Foods]
 *   description: Food management endpoints
 */
import express, { Router } from "express";
import FoodService from "../services/food-service.js";
import { requireAuth } from "../middleware/auth-middleware.js";
import ApiError from "../error/api-error.js";
import foodSchema from "../schemas/food-schema.js";
import sendResponse from "../send-response.js";

/** Food management controller */
export default class FoodController {
    router: Router;

    constructor(foodService: FoodService) {
        this.router = express.Router();

        /** @swagger
         * /food/find:
         *   get:
         *     summary: Find foods by name and amount
         *     tags: [Foods]
         *     security: [{ sessionAuth: [] }]
         *     parameters:
         *       - in: query
         *         name: name
         *         required: true
         *         schema: { type: string }
         *       - in: query
         *         name: amount
         *         required: true
         *         schema: { type: integer }
         *     responses:
         *       200: { description: Foods found }
         *       400: { description: Invalid input }
         *       401: { description: Unauthorized }
         */
        this.router.get("/find", async (req, res, next) => {
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

                const foods = await foodService.find(query, amountInt);
                sendResponse(res, 200, "success", "Foods retrieved.", { foods });

            } catch (e) { next(e); }
        });

        /** @swagger
         * /food/add:
         *   post:
         *     summary: Add new food
         *     tags: [Foods]
         *     security: [{ sessionAuth: [] }]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema: { $ref: '#/components/schemas/Food' }
         *     responses:
         *       200: { description: Food added }
         *       400: { description: Invalid input }
         *       401: { description: Unauthorized }
         */
        this.router.post("/add", requireAuth, async (req, res, next) => {
            try {
                await foodService.add({ ...foodSchema.parse(req.body), userId: req.session.userId! });
                sendResponse(res, 200, "success", "Food item successfuly added.");

            } catch (e) { next(e); }
        });
    }
}