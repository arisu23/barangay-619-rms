import type { Request, Response, NextFunction } from "express";
import { OfficialService } from "./official.service.js";

export class OfficialController {

    //Get all officials
    static async getAllOfficials(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const officials = await OfficialService.getAllOfficials();
            res.json({ success: true, data: officials });
        } catch (error) {
            next(error);
        }
    }

    //Get official by ID
    static async getOfficialById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const officialId = Number(req.params.id);
            const official = await OfficialService.getOfficialById(officialId);
            res.json({ success: true, data: official });
        } catch (error) {
            next(error);
        }
    }

    //Add official
    static async addOfficial(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user!.userId;
            const officialId = await OfficialService.addOfficial(req.body, userId);
            res.status(201).json({ success: true, data: { officialId } });
        } catch (error) {
            next(error);
        }
    }

    //Update official
    static async updateOfficial(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const officialId = Number(req.params.id);
            const userId = req.user!.userId;
            await OfficialService.updateOfficial(officialId, req.body, userId);
            res.json({ success: true, message: "Official updated successfully!" });
        } catch (error) {
            next(error);
        }
    }
}