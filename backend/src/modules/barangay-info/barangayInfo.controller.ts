import type { Request, Response, NextFunction } from "express";
import { BarangayInfoService } from "./barangayInfo.service.js";

export class BarangayInfoController {

    //Get barangay info
    static async getInfo(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const info = await BarangayInfoService.getInfo();
            res.json({ success: true, data: info });
        } catch (error) {
            next(error);
        }
    }

    //Update barangay info
    static async updateInfo(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user!.userId;
            await BarangayInfoService.updateInfo(req.body, userId);
            res.json({ success: true, message: "Barangay info updated successfully!" });
        } catch (error) {
            next(error);
        }
    }
}