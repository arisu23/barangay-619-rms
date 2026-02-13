import type { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {

    //GET /api/dashboard/stats
    static async getStats(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const stats = await DashboardService.getDashboardStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }
}