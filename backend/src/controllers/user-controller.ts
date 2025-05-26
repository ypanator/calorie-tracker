/** @swagger
 * tags: [Users]
 * description: User profile management endpoints
 */
import express, { Router } from "express";
import { requireAuth } from "../middleware/jwt-middleware.js";
import UserService from "../services/user-service.js";
import userSchema from "../schemas/user-schema.js";
import ApiError from "../error/api-error.js";
import sendResponse from "../send-response.js";

/** User profile management controller */
export default class UserController {
    router: Router;

    constructor(userService: UserService) {
        this.router = express.Router();

        /** @swagger
         * /user/profile:
         *   get:
         *     summary: Get user profile
         *     tags: [Users]
         *     security: [{ bearerAuth: [] }]
         *     responses:
         *       200: { description: Profile retrieved }
         *       401: { description: Unauthorized }
         *       500: { description: User not found }
         */
        this.router.get("/profile", requireAuth, async (req, res, next) => {
            try {
                const user = (await userService.getUserProfile(req.userId!))?.get({ plain: true }) ?? null;
                if (!user) {
                    console.log(`User does not exist in a database: ${req.userId}`);
                    throw new ApiError("User does not exist.", 500);
                }

                sendResponse(res, 200, "success", "Profile successfuly retrieved.", { user })

            } catch (e) { next(e); }
        });

        /** @swagger
         * /user/set-attr:
         *   post:
         *     summary: Update user attributes
         *     tags: [Users]
         *     security: [{ bearerAuth: [] }]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema: { $ref: '#/components/schemas/UserAttributes' }
         *     responses:
         *       200: { description: Attributes updated }
         *       400: { description: Invalid input }
         *       401: { description: Unauthorized }
         */
        this.router.post("/set-attr", requireAuth, async (req, res, next) => {
            try {
                const attributes = userSchema.parse(req.body);
                const user = await userService.updateUserAttributes(req.userId!, attributes);
                sendResponse(res, 200, "success", "Attributes successfuly set.", { user });

            } catch (e) { next(e); }
        });
    }
}