import { Router } from "express";
import { AuditTrailController } from "./audit.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorizeRole("Admin"));

router.get("/", AuditTrailController.getAuditLogs);
router.get("/search", AuditTrailController.searchAuditLogs);

export default router;