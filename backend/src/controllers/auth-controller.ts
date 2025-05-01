import express, { Router } from "express"
import authSchema from "../schemas/auth-schema";
import AuthService from "../services/auth-service";
import { authLimiter, requireAuth } from "../middleware/auth-middleware";
import sendResponse from "../send-response";

export default class AuthController {
    router: Router;

    constructor(authService: AuthService) {
        this.router = express.Router();

        this.router.post("/login", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = authSchema.parse(req.body);
                const userId: number = await authService.login(username, password);

                req.session.userId = userId;
                sendResponse(res, 200, "success", "Successfuly logged in.");

            } catch (e) { next(e); }
        });

        this.router.post("/logout", requireAuth, (req, res, next) => {
            try {
                req.session.destroy(err => { if (err) return next(err); });
                res.clearCookie("connect.sid");
                sendResponse(res, 200, "success", "Logged out successfully.")

            } catch (e) { next(e); }
        });

        this.router.post("/register", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = authSchema.parse(req.body);
                await authService.register(username, password);
                sendResponse(res, 200, "success", "Successfuly registered.");

            } catch (e) { next(e); }
        })
    };
};

