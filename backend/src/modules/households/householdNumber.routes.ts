import { Router } from "express";
import { HouseholdController } from "./household.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/household-numbers - Get all house plates
router.get("/", authorizeRole("Admin", "Staff"), HouseholdController.getAllHouseholdNumbers);

// POST /api/household-numbers - Add new house plate (Admin only)
router.post("/", authorizeRole("Admin"), HouseholdController.createHouseholdNumber);

export default router;