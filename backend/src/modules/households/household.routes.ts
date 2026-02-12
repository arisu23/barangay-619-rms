import { Router } from "express";
import { HouseholdController } from "./household.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/households - List all households (FR11)
router.get("/", authorizeRole("Admin", "Staff"), HouseholdController.getAllHouseholds);

// GET /api/households/:id - Get household by ID
router.get("/:id", authorizeRole("Admin", "Staff"), HouseholdController.getHouseholdById);

// POST /api/households - Create household
router.post("/", authorizeRole("Admin"), HouseholdController.createHousehold);

// PUT /api/households/:id - Update household (FR12)
router.put("/:id", authorizeRole("Admin"), HouseholdController.updateHousehold);

// PUT /api/households/:houseId/status - Update household number status
router.put("/:houseId/status", authorizeRole("Admin"), HouseholdController.updateHouseholdStatus);

export default router;