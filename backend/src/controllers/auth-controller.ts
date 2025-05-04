/** @swagger
 * tags: [Auth]
 * description: Authentication endpoints
 */
import express, { Router } from "express";
import authSchema from "../schemas/auth-schema.js";
import AuthService from "../services/auth-service.js";
import { authLimiter, requireAuth } from "../middleware/auth-middleware.js";
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
                const userId: number = await authService.login(username, password);

                req.session.userId = userId;
                sendResponse(res, 200, "success", "Successfuly logged in.");

            } catch (e) { next(e); }
        });

        /** @swagger
         * /auth/logout:
         *   post:
         *     summary: Log out
         *     tags: [Auth]
         *     security: [{ sessionAuth: [] }]
         *     responses:
         *       200: { description: Logged out }
         *       401: { description: Unauthorized }
         */
        this.router.post("/logout", requireAuth, (req, res, next) => {
            try {
                req.session.destroy(err => { if (err) return next(err); });
                res.clearCookie("connect.sid");
                sendResponse(res, 200, "success", "Logged out successfully.")

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
                await authService.register(username, password);
                sendResponse(res, 200, "success", "Successfuly registered.");

            } catch (e) { next(e); }
        });
    }
}

