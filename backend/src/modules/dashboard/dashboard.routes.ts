import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All routes require authentication
router.use(authenticate);

//GET /api/dashboard/stats - Both Admin and Staff can view
router.get(
    "/stats",
    authorizeRole("Admin", "Staff"),
    DashboardController.getStats
);

export default router;