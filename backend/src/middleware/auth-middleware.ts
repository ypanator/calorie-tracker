import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import ApiError from "../error/api-error.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        throw new ApiError("Unauthorized - Please login first", 401);
    }
    next();
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});