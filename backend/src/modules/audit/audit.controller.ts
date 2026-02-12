import type { Request, Response, NextFunction } from "express";
import { AuditTrailService } from "./audit.service.js";

export class AuditTrailController {
    //Get all audit logs paginated
    static async getAuditLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            //Extract query params
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;

            const result = await AuditTrailService.getAuditLogs(page, limit);

            res.json({
                success: true,
                data: result.logs,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    //Search audit logs with filters
    static async searchAuditLogs(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            //Extract filter params from query string
            const filters = {
                userId: req.query.userId ? Number(req.query.userId) : undefined,
                action: req.query.action as string | undefined,
                startDate: req.query.startDate as string | undefined,
                endDate: req.query.endDate as string | undefined
            };

            const logs = await AuditTrailService.searchAuditLogs(filters);

            res.json({
                success: true,
                data: logs
            });
            
        } catch (error) {
            next(error);
        }
    }
}