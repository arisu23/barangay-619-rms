import { pool } from "../../config/database.js";

export class HouseholdRepository {
  static async createHousehold(data: { addressId: number }) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Find available household number
      const houseRows = await conn.query(
        `SELECT HouseID FROM HouseholdNumber
       WHERE Status = 'Available'
       LIMIT 1`,
      );

      if (houseRows.length === 0) {
        throw new Error("No available household numbers!");
      }

      const houseId = houseRows[0].HouseID;

      // Create household
      const result = await conn.query(
        `INSERT INTO Household (HouseID, AddressID)
       VALUES (?, ?)`,
        [houseId, data.addressId],
      );

      // Mark household number as assigned
      await conn.query(
        `UPDATE HouseholdNumber
       SET Status = 'Assigned'
       WHERE HouseID = ?`,
        [houseId],
      );

      await conn.commit();
      return Number(result.insertId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async updateHouseholdNumberStatus(
    houseId: number,
    status: "Available" | "Assigned" | "Inactive",
  ) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        `UPDATE HouseholdNumber SET Status = ? WHERE HouseID = ?`,
        [status, houseId],
      );

      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  static async getHouseholdById(householdId: number) {
    const conn = await pool.getConnection();

    try {
      const householdRows = await conn.query(
        `SELECT 
                    h.HouseholdID,
                    hn.HouseholdNumberName AS householdNumber,
                    hn.Status AS householdStatus,
                    
                    a.AddressID,
                    a.HouseNumber,
                    a.Street_Alley_Zone,
                    a.Barangay,
                    a.Municipality
                FROM Household h
                JOIN HouseholdNumber hn ON h.HouseID = hn.HouseID
                JOIN Address a ON h.AddressID = a.AddressID
                WHERE h.HouseholdID = ?`,
        [householdId],
      );

      if (householdRows.length === 0) return null;

      const residents = await conn.query(
        `SELECT
                    r.ResidentID,
                    r.FirstName,
                    r.LastName,
                    r.Sex,
                    r.ResidentStatus
                FROM Resident r WHERE r.HouseholdID = ?`,
        [householdId],
      );

      return {
        ...householdRows[0],
        residents,
      };
    } finally {
      conn.release();
    }
  }
}
