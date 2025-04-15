import { z } from "zod";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ApiError from "./api-error";

const errorHandler: ErrorRequestHandler = (err: ApiError | z.ZodError | Error, req: Request, res: Response): void => {
    if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors });
    } else if (err instanceof Error) {
        res.status(500).json({ error: "Internal server error." });
    } else {
        res.status(err.code).json({ error: err.msg });
    }
};

export default errorHandler;