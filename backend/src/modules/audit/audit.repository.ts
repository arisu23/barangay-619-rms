import { pool } from "../../config/database.js";

interface AuditLogInput {
  userId: number;
  action: string;
  oldValue?: string | undefined;
  newValue?: string | undefined;
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
          data.newValue ?? null,
        ],
      );
    } finally {
      conn.release();
    }
  }

  static async getAll(limit: number = 50, offset: number = 0) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT a.LogID, a.UserID, u.Username, a.Action, a.OldValue, a.NewValue, a.Timestamp FROM AuditTrail a LEFT JOIN UserAccount u ON a.UserID = u.UserID ORDER BY a.Timestamp DESC LIMIT ? OFFSET ?`,
        [limit, offset],
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  static async search(filters: {
    userId?: number | undefined;
    action?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
  }) {
    const conn = await pool.getConnection();

    try {
      let sql = `SELECT a.LogID, a.UserID, u.Username, a.Action, a.OldValue, a.NewValue, a.Timestamp FROM AuditTrail a LEFT JOIN UserAccount u ON a.UserID = u.UserID WHERE 1=1`;
      const params: any[] = [];

      if (filters.userId) {
        sql += ` AND a.UserID = ?`;
        params.push(filters.userId);
      }

      if (filters.action) {
        sql += ` AND a.Action LIKE ?`;
        params.push(`%${filters.action}%`);
      }

      if (filters.startDate) {
        sql += ` AND a.Timestamp >= ?`;
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        sql += ` AND a.Timestamp <= ?`;
        params.push(filters.endDate);
      }

      sql += ` ORDER BY a.Timestamp DESC LIMIT 100`;

      return await conn.query(sql, params);
    } finally {
      conn.release();
    }
  }

  static async getTotalCount(): Promise<number> {
    const conn = await pool.getConnection();

    try {
      const rows = await conn.query(`SELECT COUNT(*) as count FROM AuditTrail`);
      const rawCount = rows[0]?.count ?? 0;

      if (typeof rawCount === "bigint") {
        return Number(rawCount);
      }

      if (typeof rawCount === "string") {
        const parsed = Number(rawCount);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      return Number(rawCount) || 0;
    } finally {
      conn.release();
    }
  }
}
