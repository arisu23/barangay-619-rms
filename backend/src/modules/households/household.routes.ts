import { Router } from "express";
import { HouseholdController } from "./household.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All household routes require login
router.use(authenticate);

//Create household
router.post(
    "/",
    authorizeRole("Admin"),
    HouseholdController.createHousehold
);

//Update household number
router.put(
    "/:houseId/status",
    authorizeRole("Admin"),
    HouseholdController.updateHouseholdStatus
);

//Get household by Id
router.get(
    "/:id",
    authorizeRole("Admin", "Staff"),
    HouseholdController.getHouseholdById
)

export default router;