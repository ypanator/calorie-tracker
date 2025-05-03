import { ZodError } from "zod";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ApiError from "../error/api-error.js"; 
import sendResponse from "../send-response.js";

const errorHandler: ErrorRequestHandler = (err: ApiError | ZodError | Error, req: Request, res: Response, next: NextFunction): void => {
    
    if (err instanceof ZodError) {
        sendResponse(res, 400, "error", "Error parsing user input.", { error: err.errors });
    } else if (err instanceof ApiError) {
        console.log(err.msg);
        sendResponse(res, err.code, "error", err.msg, { error: err.msg });
    } else if (err instanceof Error) {
        console.log(err.stack);
        sendResponse(res, 500, "error", "Internal server error.", { error: err.message });
    }
};

export default errorHandler;