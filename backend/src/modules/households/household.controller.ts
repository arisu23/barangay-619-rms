import type { Request, Response } from "express";
import { HouseholdService } from "./household.service.js";

export class HouseholdController {
  static async createHousehold(req: Request, res: Response) {
    try {
      const userId = req.user!.userId; // from auth middleware
      const householdId = await HouseholdService.createHousehold(
        req.body,
        userId,
      );

      res.status(201).json({
        success: true,
        data: { householdId },
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to create household!",
      });
    }
  }

  static async updateHouseholdStatus(req: Request, res: Response) {
    try {
      const houseId = Number(req.params.houseId);
      const { status } = req.body;
      const userId = req.user!.userId;

      await HouseholdService.updateHouseholdNumber(houseId, status, userId);

      res.json({
        success: true,
        message: "Household status updated!",
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update status!",
      });
    }
  }

  static async getHouseholdById(req: Request, res: Response) {
    try {
      const householdId = Number(req.params.id);
      const household = await HouseholdService.getHouseholdById(householdId);

      res.json({
        success: true,
        data: household,
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed too retrieve household!",
      });
    }
  }

  static async getAllHouseholds(_req: Request, res: Response) {
    try {
      const households = await HouseholdService.getAllHouseholds();
      res.json({ success: true, data: households });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to retrieve households!",
      });
    }
  }

  static async updateHousehold(req: Request, res: Response) {
    try {
      const householdId = Number(req.params.id);
      const userId = req.user!.userId;
      await HouseholdService.updateHousehold(householdId, req.body, userId);
      res.json({ success: true, message: "Household updated successfully!" });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update household!",
      });
    }
  }

  static async getAllHouseholdNumbers(_req: Request, res: Response) {
    try {
      const numbers = await HouseholdService.getAllHouseholdNumbers();
      res.json({ success: true, data: numbers });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to retrieve household numbers!",
      });
    }
  }

  static async getAllHouseholdAddresses(_req: Request, res: Response) {
    try {
      const addresses = await HouseholdService.getAllHouseholdAddresses();
      res.json({ success: true, data: addresses });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to retrieve addresses!",
      });
    }
  }

  static async updateHouseholdNumberName(req: Request, res: Response) {
    try {
      const houseId = Number(req.params.houseId);
      const { name } = req.body;
      const userId = req.user!.userId;

      await HouseholdService.renameHouseholdNumber(houseId, name, userId);

      res.json({
        success: true,
        message: "Household number name updated!",
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update household number name!",
      });
    }
  }

  static async createHouseholdNumber(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const houseId = await HouseholdService.createHouseholdNumber(
        req.body,
        userId,
      );
      res.status(201).json({ success: true, data: { houseId } });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to create household number!",
      });
    }
  }
}
