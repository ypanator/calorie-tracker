import { Response } from "express";

export default function sendResponse(res: Response, httpStatus: number, result: "success" | "error", msg: string, data: any = null) {
    res.status(httpStatus).json({ result, msg, data });
}