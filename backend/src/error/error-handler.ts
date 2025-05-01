import { z } from "zod";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ApiError from "./api-error";
import sendResponse from "../send-response";

const errorHandler: ErrorRequestHandler = (err: ApiError | z.ZodError | Error, req: Request, res: Response): void => {
    
    if (err instanceof z.ZodError) {
        sendResponse(res, 400, "error", "Error parsing user input.", { error: err.errors });
    } else if (err instanceof Error) {
        console.log(err);
        sendResponse(res, 500, "error", "Internal server error.", { error: err.message });
    } else {
        console.log(err);
        sendResponse(res, err.code, "error", "Internal server error.", { error: err.msg });
    }
};

export default errorHandler;