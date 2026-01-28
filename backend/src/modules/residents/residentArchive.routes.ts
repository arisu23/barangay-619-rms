import { Router } from "express";
import { ResidentArchiveController } from "./residentArchive.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/residents/archive
 * Get all archived residents
 * UC14 – Manage Archive Registry
 * Access: Admin, Staff
 */
router.get(
    "/",
    authorizeRole("Admin", "Staff"),
    ResidentArchiveController.getArchivedResidents
);

/**
 * POST /api/residents/archive/:id
 * Archive a resident (Deceased or MovedOut)
 * UC5 – Archive Resident Record
 * Access: Admin, Staff
 */
router.post(
    "/:id",
    authorizeRole("Admin", "Staff"),
    ResidentArchiveController.archiveResident
);

/**
 * POST /api/residents/archive/:id/restore
 * Restore an archived resident back to Active
 * UC14 – Manage Archive Registry
 * Access: Admin, Staff
 */
router.post(
    "/:id/restore",
    authorizeRole("Admin", "Staff"),
    ResidentArchiveController.restoreResident
);

export default router;
