import type { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: ENV.NODE_ENV === "development" ? err.message || "Internal Server Error" : "Something went wrong!"
    });
}