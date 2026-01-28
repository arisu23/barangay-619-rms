import type { Request, Response, NextFunction } from "express";
import { ResidentArchiveService } from "./residentArchive.service.js";

export class ResidentArchiveController {

    //Archive resident (Deceased or MovedOut)
    static async archiveResident(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const residentId = Number(req.params.id);
            const { status, dateOfDeath } = req.body;
            const userId = req.user!.userId;

            const result = await ResidentArchiveService.archiveResident(
                residentId,
                status,
                dateOfDeath || null,
                userId
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    //Restore archived resident back to Active
    static async restoreResident(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const residentId = Number(req.params.id);
            const userId = req.user!.userId;

            const result = await ResidentArchiveService.restoreResident(
                residentId,
                userId
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Get all archived residents
    static async getArchivedResidents(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const archived = await ResidentArchiveService.getArchivedResidents();

            res.json({
                success: true,
                data: archived
            });
        } catch (error) {
            next(error);
        }
    }
}
