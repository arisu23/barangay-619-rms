import { Router } from "express";
import { FamilyController } from "./family.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

//All family routes require authentication
router.use(authenticate);

//Assign initial household head
router.post("/head", authorizeRole("Admin", "Staff"), FamilyController.assignHouseholdHead);

//Add family member
router.post("/member", authorizeRole("Admin", "Staff"), FamilyController.addFamilyMember);

//Change household head
router.put("/change-head", authorizeRole("Admin", "Staff"), FamilyController.changeHouseholdHead);

//View family by household
router.get("/household/:householdId", authorizeRole("Admin", "Staff"), FamilyController.getFamilyByHousehold);

export default router;
