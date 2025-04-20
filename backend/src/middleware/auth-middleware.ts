import { Request, Response, NextFunction } from "express";
import ApiError from "../error-handler/api-error";
import rateLimit from 'express-rate-limit';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        throw new ApiError("Unauthorized - Please login first", 401);
    }
    next();
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});