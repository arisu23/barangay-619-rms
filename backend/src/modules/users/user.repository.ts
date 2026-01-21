import { pool } from "../../config/database.js";

export const UserRepository = {
  async create(username: string, password: string, role: "Admin" | "Staff") {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        `INSERT INTO UserAccount (Username, Password, Role) VALUES (?, ?, ?)`,
        [username, password, role],
      );
      return Number(result.insertId);
    } catch (err: any) {
        if (err.errno === 1062) {
            throw { status: 409, message: "Username already exists!" };
        }
        throw err;
    } finally {
      conn.release();
    }
  },

  async findByUsername(username: string) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT * FROM UserAccount WHERE Username = ? AND AccStatus = 'Active'`,
        [username],
      );
      return rows[0];
    } finally {
      conn.release();
    }
  },
};
