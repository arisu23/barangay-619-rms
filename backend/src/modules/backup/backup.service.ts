import { BackupRepository } from "./backup.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";
import { ENV } from "../../config/env.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

//Centralized config from ENV
const BACKUP_DIR = path.resolve(ENV.BACKUP_DIR);
const DB_HOST = ENV.DB_HOST;
const DB_USER = ENV.DB_USER;
const DB_PASS = ENV.DB_PASSWORD;
const DB_NAME = ENV.DB_NAME;
const MYSQLDUMP_PATH = ENV.MYSQLDUMP_PATH;
const MYSQL_PATH = ENV.MYSQL_PATH;

export class BackupService {

    //Create full database backup (FR7, UC13)
    static async createBackup(userId: number) {

        //Ensure backup directory exists
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        //Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const time = new Date().toTimeString().slice(0, 8).replace(/:/g, "");
        const fileName = `BRMS_FULL_${timestamp}_${time}.sql`;
        const filePath = path.join(BACKUP_DIR, fileName);

        //Log as Pending first
        const backupId = await BackupRepository.create({
            fileName,
            filePath: BACKUP_DIR,
            backupStatus: "Pending",
            backupType: "Backup"
        });

        try {
            //Execute mysqldump using XAMPP path
            const passFlag = DB_PASS ? `-p${DB_PASS}` : "";
            const cmd = `"${MYSQLDUMP_PATH}" -h ${DB_HOST} -u ${DB_USER} ${passFlag} ${DB_NAME} > "${filePath}"`;

            await execAsync(cmd);

            //Verify file was created
            if (!fs.existsSync(filePath)) {
                throw new Error("Backup file was not created!");
            }

            //Update status to Successful
            await BackupRepository.updateStatus(backupId, "Successful");

            //Audit log
            await AuditTrailRepository.log({
                userId,
                action: "CREATE_BACKUP",
                newValue: JSON.stringify({ backupId, fileName, filePath: BACKUP_DIR })
            });

            return { backupId, fileName, filePath: BACKUP_DIR };

        } catch (error: any) {
            //Update status to Failed
            await BackupRepository.updateStatus(backupId, "Failed");

            //Audit log failure
            await AuditTrailRepository.log({
                userId,
                action: "BACKUP_FAILED",
                newValue: JSON.stringify({ backupId, error: error.message })
            });

            throw { status: 500, message: `Backup failed: ${error.message}` };
        }
    }

    //Restore database from uploaded .sql file (FR10, UC13)
    static async restoreBackup(uploadedFilePath: string, originalFileName: string, userId: number) {

        //Validate file exists
        if (!fs.existsSync(uploadedFilePath)) {
            throw { status: 400, message: "Backup file not found!" };
        }

        //Log as Pending
        const backupId = await BackupRepository.create({
            fileName: originalFileName,
            filePath: uploadedFilePath,
            backupStatus: "Pending",
            backupType: "Restore"
        });

        try {
            //Execute restore via XAMPP mysql CLI
            const passFlag = DB_PASS ? `-p${DB_PASS}` : "";
            const cmd = `"${MYSQL_PATH}" -h ${DB_HOST} -u ${DB_USER} ${passFlag} ${DB_NAME} < "${uploadedFilePath}"`;

            await execAsync(cmd);

            //Update status to Successful
            await BackupRepository.updateStatus(backupId, "Successful");

            //Audit log
            await AuditTrailRepository.log({
                userId,
                action: "RESTORE_BACKUP",
                newValue: JSON.stringify({ backupId, fileName: originalFileName })
            });

            return { backupId, message: "Database restored successfully!" };

        } catch (error: any) {
            //Update status to Failed
            await BackupRepository.updateStatus(backupId, "Failed");

            //Audit log failure
            await AuditTrailRepository.log({
                userId,
                action: "RESTORE_FAILED",
                newValue: JSON.stringify({ backupId, error: error.message })
            });

            throw { status: 500, message: `Restore failed: ${error.message}` };
        }
    }

    //Get all backup/restore logs
    static async getBackupLogs() {
        return BackupRepository.getAll();
    }

    //Download backup file
    static async getBackupFile(backupId: number) {
        const backup = await BackupRepository.getById(backupId);
        if (!backup) {
            throw { status: 404, message: "Backup record not found!" };
        }

        const fullPath = path.join(backup.FilePath, backup.FileName);
        if (!fs.existsSync(fullPath)) {
            throw { status: 404, message: "Backup file no longer exists on disk!" };
        }

        return { fullPath, fileName: backup.FileName };
    }
}