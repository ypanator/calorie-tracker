import express, { Router } from "express"
import { requireAuth } from "../middleware/auth-middleware";
import UserService from "../services/user-service";
import userSchema from "../schemas/user-schema";

export default class UserController {
    router: Router;

    constructor(userService: UserService) {
        this.router = express.Router();

        this.router.get("/profile", requireAuth, async (req, res, next) => {
            try {
                const data = userService.getData(req.session.userId!);
               res.status(200).json({ data: data }); 
            } catch (e) { next(e); }
        });

        this.router.post("/set-params", requireAuth, async (req, res, next) => {
            try {
                const newParams = userSchema.parse(req.body);
                userService.setParams(newParams);

                const data = userService.getData(req.session.userId!);
               res.status(200).json({ data: data }); 
            } catch (e) { next(e); }
        });
    };
}