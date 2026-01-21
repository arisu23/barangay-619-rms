import type { Request, Response, NextFunction } from "express";

export function authorizeRole(role: "Admin" | "Staff") {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (user.role !== role) {
            return res.status(403).json({ message: "Access denied!" });
        }
        next();
    };
}