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
                await authService.login(username, password);
                res.status(200).json("Successfuly logged in.");
            } catch (e) { next(e); }
        });

        this.router.post("/logout", (req, res, next) => {
            try {
                authService.logout();
                res.status(200).json("Successfuly logged out.");
            } catch (e) { next(e); }
        });
    };
};

