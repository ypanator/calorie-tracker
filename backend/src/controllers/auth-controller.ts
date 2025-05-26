/** @swagger
 * tags: [Auth]
 * description: Authentication endpoints
 */
import express, { Router } from "express";
import authSchema from "../schemas/auth-schema.js";
import AuthService from "../services/auth-service.js";
import { authLimiter, requireAuth } from "../middleware/jwt-middleware.js";
import sendResponse from "../send-response.js";

/** Authentication controller */
export default class AuthController {
    router: Router;

    constructor(authService: AuthService) {
        this.router = express.Router();

        /** @swagger
         * /auth/login:
         *   post:
         *     summary: Log in
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username: { type: string }
         *               password: { type: string }
         *     responses:
         *       200: { description: Logged in }
         *       400: { description: Invalid credentials }
         *       429: { description: Too many attempts }
         */
        this.router.post("/login", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = authSchema.parse(req.body);
                const token = await authService.login(username, password);
                sendResponse(res, 200, "success", "Successfully logged in.", { token });
            } catch (e) { next(e); }
        });

        /** @swagger
         * /auth/register:
         *   post:
         *     summary: Register new user
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username: { type: string }
         *               password: { type: string }
         *     responses:
         *       200: { description: Registered }
         *       400: { description: Invalid input or username taken }
         *       429: { description: Too many attempts }
         */
        this.router.post("/register", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = authSchema.parse(req.body);
                const token = await authService.register(username, password);
                sendResponse(res, 200, "success", "Successfully registered.", { token });
            } catch (e) { next(e); }
        });
    }
}

