import { pool } from "../../config/database.js";

interface AuditLogInput {
    userId: number;
    action: string;
    oldValue?: string;
    newValue?: string;
}

export class AuditTrailRepository {
    static async log(data: AuditLogInput) {
        const conn = await pool.getConnection();

        try {
            await conn.query(
                `INSERT INTO AuditTrail (UserID, Action, OldValue, NewValue) VALUES (?, ?, ?, ?)`,
                [
                    data.userId,
                    data.action,
                    data.oldValue ?? null,
                    data.newValue ?? null
                ]
            );
        } finally {
            conn.release();
        }
    }
}