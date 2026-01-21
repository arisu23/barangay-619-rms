import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token!" });

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Malformed token!" });
    }

    try {
        const payload = jwt.verify(token, ENV.JWT_SECRET) as any;
        (req as any).user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token!" });
    }
}