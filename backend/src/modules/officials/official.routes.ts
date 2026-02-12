import { Router } from "express";
import { OfficialController } from "./official.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All routes require authentication
router.use(authenticate);

//UC11 – Admin only for management
router.use(authorizeRole("Admin"));

//GET /api/officials - List all officials
router.get("/", OfficialController.getAllOfficials);

//GET /api/officials/:id - Get official by ID
router.get("/:id", OfficialController.getOfficialById);

//POST /api/officials - Add official
router.post("/", OfficialController.addOfficial);

//PUT /api/officials/:id - Update official
router.put("/:id", OfficialController.updateOfficial);

export default router;