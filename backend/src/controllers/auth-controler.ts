import express, { Router } from "express"
import { AuthSchema } from "../schemas/auth-schema";
import AuthService from "../services/auth-service";

export default class AuthController {
    router: Router;

    constructor(authService: AuthService) {
        this.router = express.Router();

        this.router.post("/login", async (req, res, next) => {
            try {
                const { username, password } = AuthSchema.parse(req.body);
                const user_id: number = await authService.login(username, password);

                req.session.user_id = user_id;
                res.status(200).json("Successfuly logged in.");
            } catch (e) { next(e); }
        });

        this.router.post("/logout", (req, res, next) => {
            try {
                req.session.destroy(() => {});
                res.clearCookie("connect.sid");
                res.status(200).send("Logged out successfully.");
            } catch (e) { next(e); }
        });

        this.router.post("/register", async (req, res, next) => {
            try {
                const { username, password } = AuthSchema.parse(req.body);
                await authService.register(username, password);
                res.status(200).json("Successfuly registered.");
            } catch (e) { next(e); }
        })
    };
};

