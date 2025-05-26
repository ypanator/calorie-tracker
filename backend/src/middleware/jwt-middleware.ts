import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import ApiError from "../error/api-error.js";

const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
};

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError("Unauthorized - Please provide valid token", 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, getJWTSecret()) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch (err) {
        throw new ApiError("Invalid or expired token", 401);
    }
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
});
