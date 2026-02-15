import type { Request, Response, NextFunction } from "express";
import { BackupService } from "./backup.service.js";

export class BackupController {

    //POST /api/backup - Create backup
    static async createBackup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user!.userId;
            const result = await BackupService.createBackup(userId);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    //POST /api/backup/restore - Restore from uploaded .sql file
    static async restoreBackup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user!.userId;
            const file = req.file;

            if (!file) {
                res.status(400).json({ success: false, message: "No backup file uploaded!" });
                return;
            }

            const result = await BackupService.restoreBackup(
                file.path,
                file.originalname,
                userId
            );
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    //GET /api/backup - List all backup logs
    static async getBackupLogs(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const logs = await BackupService.getBackupLogs();
            res.json({ success: true, data: logs });
        } catch (error) {
            next(error);
        }
    }

    //GET /api/backup/:id/download - Download backup file
    static async downloadBackup(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const backupId = Number(req.params.id);
            const { fullPath, fileName } = await BackupService.getBackupFile(backupId);
            res.download(fullPath, fileName);
        } catch (error) {
            next(error);
        }
    }
}