import type { Request, Response, NextFunction } from "express";
import { ResidentService } from "./resident.service.js";

export class ResidentController {
    static async createResident(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user!.userId;
            const residentId = await ResidentService.createResident(req.body, userId);

            res.status(201).json({
                success: true,
                data: { residentId }
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllResidents(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const residents = await ResidentService.getAllResidents();

            res.json({
                success: true,
                data:residents
            });
        } catch (err) {
            next(err);
        }
    }

    static async getResidentById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = Number(req.params.id);
            const resident = await ResidentService.getResidentById(id);

            res.json({
                success: true,
                data: resident
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateResident(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = Number(req.params.id)
            const userId = req.user!.userId;

            await ResidentService.updateResident(id, req.body, userId);

            res.json({
                success: true,
                message: "Resident updated successfully!"
            });
        } catch (err) {
            next(err);
        }
    }

    static async searchResidents(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const results = await ResidentService.searchResidents(req.query);

            res.json({
                success: true,
                data: results
            });
        } catch (err) {
            next(err);
        }
    }
}