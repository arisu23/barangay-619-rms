import { Router } from "express";
import { ResidentArchiveController } from "./residentArchive.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/archives - List archived residents (UC14)
router.get("/", authorizeRole("Admin", "Staff"), ResidentArchiveController.getArchivedResidents);

// POST /api/archives/:id - Archive a resident (UC5)
router.post("/:id", authorizeRole("Admin", "Staff"), ResidentArchiveController.archiveResident);

// POST /api/archives/:id/restore - Restore archived resident (UC14)
router.post("/:id/restore", authorizeRole("Admin", "Staff"), ResidentArchiveController.restoreResident);

// GET /api/archives/history/:residentId - Get resident history (FR14)
router.get("/history/:residentId", authorizeRole("Admin", "Staff"), ResidentArchiveController.getResidentHistory);

export default router;
