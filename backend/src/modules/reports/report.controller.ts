import type { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service.js";
import { ReportRepository } from "./report.repository.js";
import { ProfilePdfService } from "./profile-pdf.service.js";

export class ReportController {
  //GET /api/reports/demographics - Summary stats + chart data
  static async getDemographicsSummary(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await ReportService.getDemographicsSummary();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  //GET /api/reports/demographics/:category - Detailed breakdown
  static async getDemographicsByCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const category = req.params.category as string;
      const search = String(req.query.search || "");
      const rawPage = Number(req.query.page);
      const rawLimit = Number(req.query.limit);
      const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
      const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 10;

      const data = await ReportService.getDemographicsByCategory(
        category,
        search,
        page,
        limit,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  //GET /api/reports/rbi/form-a - Form A data
  static async getFormAData(req: Request, res: Response, next: NextFunction) {
    try {
      const householdId = req.query.householdId
        ? Number(req.query.householdId)
        : undefined;

      const data = await ReportService.getFormAData(householdId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  //GET /api/reports/rbi/form-c - Form C data
  static async getFormCData(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReportService.getFormCData();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  //GET /api/reports/residents/:id/pdf - Download resident profile PDF (FR4)
  static async downloadResidentPdf(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid resident ID" });
        return;
      }

      const resident = await ReportRepository.getResidentFullProfile(id);
      if (!resident) {
        res.status(404).json({ success: false, message: "Resident not found" });
        return;
      }

      ProfilePdfService.generate(resident, res);
    } catch (error) {
      next(error);
    }
  }
}
