import { pool } from "../../config/database.js";

export class BackupRepository {

    //Log a backup/restore operation
    static async create(data: {
        fileName: string;
        filePath: string;
        backupStatus: "Successful" | "Failed" | "Pending";
        backupType: "Backup" | "Restore";
    }) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                `INSERT INTO Backup (FileName, FilePath, BackupStatus, BackupType) VALUES (?, ?, ?, ?)`,
                [data.fileName, data.filePath, data.backupStatus, data.backupType]
            );
            return Number(result.insertId);
        } finally {
            conn.release();
        }
    }

    //Update backup status
    static async updateStatus(backupId: number, status: "Successful" | "Failed") {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                `UPDATE Backup SET BackupStatus = ? WHERE BackupID = ?`,
                [status, backupId]
            );
        } finally {
            conn.release();
        }
    }

    //Get all backup logs (for Operation Logs table)
    static async getAll() {
        const conn = await pool.getConnection();
        try {
            return await conn.query(
                `SELECT BackupID, FileName, FilePath, DateCreated, BackupStatus, BackupType 
                FROM Backup 
                ORDER BY DateCreated DESC`
            );
        } finally {
            conn.release();
        }
    }

    //Get backup by ID
    static async getById(backupId: number) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT BackupID, FileName, FilePath, DateCreated, BackupStatus, BackupType 
                FROM Backup WHERE BackupID = ?`,
                [backupId]
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    }
}