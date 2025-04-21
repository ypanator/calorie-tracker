import express, { Router } from "express"
import { AuthSchema } from "../schemas/auth-schema";
import AuthService from "../services/auth-service";
import { authLimiter, requireAuth } from "../middleware/auth-middleware";

export default class AuthController {
    router: Router;

    constructor(authService: AuthService) {
        this.router = express.Router();

        this.router.post("/login", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = AuthSchema.parse(req.body);
                const userId: number = await authService.login(username, password);

                req.session.userId = userId;
                res.status(200).json("Successfuly logged in.");
            } catch (e) { next(e); }
        });

        this.router.post("/logout", requireAuth, (req, res, next) => {
            try {
                req.session.destroy(() => {});
                res.clearCookie("connect.sid");
                res.status(200).send("Logged out successfully.");

            } catch (e) { next(e); }
        });

        this.router.post("/register", authLimiter, async (req, res, next) => {
            try {
                const { username, password } = AuthSchema.parse(req.body);
                await authService.register(username, password);
                res.status(200).json("Successfuly registered.");

            } catch (e) { next(e); }
        })
    };
};

