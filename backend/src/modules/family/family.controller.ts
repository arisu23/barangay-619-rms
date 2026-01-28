import type { Request, Response } from "express";
import { FamilyService } from "./family.service.js";

export class FamilyController {
    
    //Assign initial household head
    static async assignHouseholdHead(req:Request, res: Response) {
        try {
            const { householdId, residentId } = req.body;
            const userId = req.user!.userId;

            await FamilyService.assignHouseholdHead(Number(householdId), Number(residentId), userId);

            res.status(201).json({
                success: true,
                message: "Household head assigned successfully!"
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to assign household head!"
            });
        }
    }

    //Add family member
    static async addFamilyMember(req:Request, res: Response) {
        try {
            const { familyHeadId, residentId, relationship } = req.body;
            const userId = req.user!.userId;

            await FamilyService.addFamilyMember(Number(familyHeadId), Number(residentId), relationship, userId);

            res.status(201).json({
                success: true,
                message: "Family member added successfully!"
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to add family member!"
            });
        }
    }

    //Change household head
    static async changeHouseholdHead(req:Request, res: Response) {
        try {
            const { householdId, currentHeadId } = req.body;
            const userId = req.user!.userId;

            await FamilyService.changeHouseholdHead(Number(householdId), Number(currentHeadId), userId);

            res.status(200).json({
                success: true,
                message: "Household head changed successfully!"
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to change household head!"
            });
        }
    }

    //View family by household
    static async getFamilyByHousehold(req:Request, res: Response) {
        try {
            const householdId = Number(req.params.householdId);

            const family = await FamilyService.getFamilyByHousehold(householdId);

            res.status(200).json({
                success: true,
                data: family
            });
        } catch (err: any) {
            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Failed to get family!"
            });
        }
    }
}
