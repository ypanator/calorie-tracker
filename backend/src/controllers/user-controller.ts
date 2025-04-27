import express, { Router } from "express"
import { requireAuth } from "../middleware/auth-middleware";
import UserService from "../services/user-service";
import userSchema from "../schemas/user-schema";
import ApiError from "../error/api-error";

export default class UserController {
    router: Router;

    constructor(userService: UserService) {
        this.router = express.Router();

        this.router.get("/profile", requireAuth, async (req, res, next) => {
            try {
                const user = (await userService.getUserProfile(req.session.userId!))?.get({ plain: true }) ?? null;
                if (!user) {
                    console.log(`User does not exist in a database but the session is set ${req.session.userId}`);
                    throw new ApiError("User does not exist.", 500);
                }

                res.status(200).json({ user: user }); 
            } catch (e) { next(e); }
        });

        this.router.post("/set-attr", requireAuth, async (req, res, next) => {
            try {
                const attributes = userSchema.parse(req.body);
                const userId: number = req.session.userId!
                const user = await userService.updateUserAttributes(userId, attributes);

               res.status(200).json({ user: user }); 
            } catch (e) { next(e); }
        });
    };
}