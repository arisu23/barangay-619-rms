import { Router } from "express";
import { HouseholdController } from "./household.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/household-numbers/addresses - Get address options for linking household numbers
router.get(
  "/addresses",
  authorizeRole("Admin", "Staff"),
  HouseholdController.getAllHouseholdAddresses,
);

// GET /api/household-numbers - Get all house plates
router.get(
  "/",
  authorizeRole("Admin", "Staff"),
  HouseholdController.getAllHouseholdNumbers,
);

// PUT /api/household-numbers/:houseId/name - Update household number name (Admin only)
router.put(
  "/:houseId/name",
  authorizeRole("Admin"),
  HouseholdController.updateHouseholdNumberName,
);

// POST /api/household-numbers - Add new house plate (Admin only)
router.post(
  "/",
  authorizeRole("Admin"),
  HouseholdController.createHouseholdNumber,
);

export default router;
