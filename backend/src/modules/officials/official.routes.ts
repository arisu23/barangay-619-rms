import { Router } from "express";
import { OfficialController } from "./official.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All routes require authentication
router.use(authenticate);

//GET /api/officials - List all officials
router.get(
  "/",
  authorizeRole("Admin", "Staff"),
  OfficialController.getAllOfficials,
);

//GET /api/officials/active - List active officials (effective today)
router.get(
  "/active",
  authorizeRole("Admin", "Staff"),
  OfficialController.getActiveOfficials,
);

//GET /api/officials/:id - Get official by ID
router.get(
  "/:id",
  authorizeRole("Admin", "Staff"),
  OfficialController.getOfficialById,
);

//POST /api/officials - Add official
router.post("/", authorizeRole("Admin"), OfficialController.addOfficial);

//PUT /api/officials/:id - Update official
router.put("/:id", authorizeRole("Admin"), OfficialController.updateOfficial);

export default router;
