import { pool } from "../../config/database.js";
export class OfficialRepository {
    //Get all officials with resident name
    static async getAll() {
        const conn = await pool.getConnection();
        try {
            return await conn.query(
                `SELECT 
                    o.OfficialID,
                    o.ResidentID,
                    r.FirstName,
                    r.LastName,
                    o.Position,
                    o.TermStart,
                    o.TermEnd,
                    o.BStatus
                FROM BarangayOfficial o
                JOIN Resident r ON o.ResidentID = r.ResidentID
                ORDER BY o.BStatus ASC, o.TermStart DESC`
            );
        } finally {
            conn.release();
        }
    }
    //Get official by ID
    static async getById(officialId: number) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT 
                    o.OfficialID,
                    o.ResidentID,
                    r.FirstName,
                    r.LastName,
                    o.Position,
                    o.TermStart,
                    o.TermEnd,
                    o.BStatus
                FROM BarangayOfficial o
                JOIN Resident r ON o.ResidentID = r.ResidentID
                WHERE o.OfficialID = ?`,
                [officialId]
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    }
    //Add official
    static async create(data: {
        residentId: number;
        position: string;
        termStart: string;
        termEnd: string | null;
    }) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                `INSERT INTO BarangayOfficial (ResidentID, Position, TermStart, TermEnd) VALUES (?, ?, ?, ?)`,
                [data.residentId, data.position, data.termStart, data.termEnd ?? null]
            );
            return Number(result.insertId);
        } finally {
            conn.release();
        }
    }
    //Update official
    static async update(officialId: number, data: {
        position?: string;
        termStart?: string;
        termEnd?: string | null;
        bStatus?: string;
    }) {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(
                `UPDATE BarangayOfficial 
                SET Position = ?, TermStart = ?, TermEnd = ?, BStatus = ? 
                WHERE OfficialID = ?`,
                [data.position, data.termStart, data.termEnd ?? null, data.bStatus, officialId]
            );
            return result.affectedRows > 0;
        } finally {
            conn.release();
        }
    }
    //Check if resident is already an active official
    static async isActiveOfficial(residentId: number): Promise<boolean> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT OfficialID FROM BarangayOfficial 
                WHERE ResidentID = ? AND BStatus = 'Active'`,
                [residentId]
            );
            return rows.length > 0;
        } finally {
            conn.release();
        }
    }
}