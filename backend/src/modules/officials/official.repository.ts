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
                ORDER BY CASE WHEN o.BStatus = 'Active' THEN 0 ELSE 1 END,
                         o.TermStart DESC`,
      );
    } finally {
      conn.release();
    }
  }

  //Get active officials effective on a given date (default: today)
  static async getActiveAsOf(asOfDate?: string) {
    const conn = await pool.getConnection();
    try {
      if (asOfDate) {
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
                    WHERE o.BStatus = 'Active'
                      AND o.TermStart <= ?
                      AND (o.TermEnd IS NULL OR o.TermEnd >= ?)
                    ORDER BY o.Position ASC, o.TermStart DESC`,
          [asOfDate, asOfDate],
        );
      }

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
                WHERE o.BStatus = 'Active'
                  AND o.TermStart <= CURDATE()
                  AND (o.TermEnd IS NULL OR o.TermEnd >= CURDATE())
                ORDER BY o.Position ASC, o.TermStart DESC`,
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
        [officialId],
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
        [data.residentId, data.position, data.termStart, data.termEnd ?? null],
      );
      return Number(result.insertId);
    } finally {
      conn.release();
    }
  }

  //Add official and switch previous active official (same position) to former
  static async createActiveWithTransition(data: {
    residentId: number;
    position: string;
    termStart: string;
    termEnd: string | null;
  }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE BarangayOfficial
                 SET BStatus = 'Former',
                     TermEnd = CASE
                         WHEN TermEnd IS NULL OR TermEnd >= ? THEN DATE_SUB(?, INTERVAL 1 DAY)
                         ELSE TermEnd
                     END
                 WHERE Position = ? AND BStatus = 'Active'`,
        [data.termStart, data.termStart, data.position],
      );

      const result = await conn.query(
        `INSERT INTO BarangayOfficial (ResidentID, Position, TermStart, TermEnd, BStatus)
                 VALUES (?, ?, ?, ?, 'Active')`,
        [data.residentId, data.position, data.termStart, data.termEnd ?? null],
      );

      await conn.commit();
      return Number(result.insertId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
  //Update official
  static async update(
    officialId: number,
    data: {
      position?: string;
      termStart?: string;
      termEnd?: string | null;
      bStatus?: string;
    },
  ) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        `UPDATE BarangayOfficial 
                SET Position = ?, TermStart = ?, TermEnd = ?, BStatus = ? 
                WHERE OfficialID = ?`,
        [
          data.position,
          data.termStart,
          data.termEnd ?? null,
          data.bStatus,
          officialId,
        ],
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  //Activate official and switch previous active official (same position) to former
  static async activateOfficial(
    officialId: number,
    data: {
      position: string;
      termStart: string;
      termEnd: string | null;
    },
  ) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE BarangayOfficial
                 SET BStatus = 'Former',
                     TermEnd = CASE
                         WHEN TermEnd IS NULL OR TermEnd >= ? THEN DATE_SUB(?, INTERVAL 1 DAY)
                         ELSE TermEnd
                     END
                 WHERE Position = ? AND BStatus = 'Active' AND OfficialID <> ?`,
        [data.termStart, data.termStart, data.position, officialId],
      );

      const result = await conn.query(
        `UPDATE BarangayOfficial
                 SET Position = ?, TermStart = ?, TermEnd = ?, BStatus = 'Active'
                 WHERE OfficialID = ?`,
        [data.position, data.termStart, data.termEnd ?? null, officialId],
      );

      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
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
        [residentId],
      );
      return rows.length > 0;
    } finally {
      conn.release();
    }
  }
}
