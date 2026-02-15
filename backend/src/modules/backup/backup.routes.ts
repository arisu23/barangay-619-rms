import { Router } from "express";
import { BackupController } from "./backup.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";
import multer from "multer";
import path from "path";

//Configure multer for .sql file uploads
const upload = multer({
    dest: path.resolve("backups/uploads/"),
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === ".sql") {
            cb(null, true);
        } else {
            cb(new Error("Only .sql files are allowed!"));
        }
    },
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB max
});

const router = Router();

//All routes require authentication + Admin only (UC13)
router.use(authenticate);
router.use(authorizeRole("Admin"));

//POST /api/backup - Create full backup
router.post("/", BackupController.createBackup);

//GET /api/backup - List backup/restore logs
router.get("/", BackupController.getBackupLogs);

//POST /api/backup/restore - Restore from uploaded .sql file
router.post("/restore", upload.single("backupFile"), BackupController.restoreBackup);

//GET /api/backup/:id/download - Download backup file
router.get("/:id/download", BackupController.downloadBackup);

export default router;