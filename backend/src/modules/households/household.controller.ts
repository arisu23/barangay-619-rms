import type { Request, Response } from "express";
import { HouseholdService } from "./household.service.js";

export class HouseholdController {
    static async createHousehold(req: Request, res: Response) {
        try {
            const userId = req.user!.userId; // from auth middleware
            const householdId = await HouseholdService.createHousehold(
                req.body,
                userId
            );

            res.status(201).json({
                success: true,
                data: { householdId }
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to create household!"
            });
        }
    }

    static async updateHouseholdStatus(req: Request, res: Response) {
        try {
            const houseId = Number(req.params.houseId);
            const { status } = req.body;
            const userId = req.user!.userId;

            await HouseholdService.updateHouseholdNumber(
                houseId, status, userId
            );

            res.json({
                success: true,
                message: "Household status updated!"
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to update status!"
            });
        }
    }

    static async getHouseholdById(req: Request, res: Response) {
        try {
            const householdId = Number(req.params.id);
            const household = await HouseholdService.getHouseholdById(householdId);

            res.json({
                success: true,
                data: household
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed too retrieve household!"
            });
        }
    }
}