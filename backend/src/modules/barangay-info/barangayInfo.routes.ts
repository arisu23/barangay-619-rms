import { Router } from "express";
import { BarangayInfoController } from "./barangayInfo.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All routes require authentication
router.use(authenticate);

//GET /api/barangay-info - Get info (Admin/Staff can view)
router.get("/", authorizeRole("Admin", "Staff"), BarangayInfoController.getInfo);

//PUT /api/barangay-info - Update info (Admin only - UC10)
router.put("/", authorizeRole("Admin"), BarangayInfoController.updateInfo);

export default router;