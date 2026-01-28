import { pool } from "../../config/database.js";

export class ResidentRepository {
  static async createResident(data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      //Add Address
      const addressResult = await conn.query(
        `INSERT INTO Address (HouseNumber, Street_Alley_Zone, Barangay, Municipality) VALUES (?, ?, ?, ?)`,
        [
          data.address.houseNumber,
          data.address.street,
          data.address.barangay,
          data.address.municipality,
        ],
      );

      const addressId = Number(addressResult.insertId);

      //Add Household
      let householdId: number | null = null;

      if (data.householdId) {
        householdId = data.householdId;
      }

      //Add Resident
      const residentResult = await conn.query(
        `INSERT INTO Resident (FirstName, MiddleName, LastName, Sex, DateOfBirth, PlaceOfBirth, CivilStatus, Citizenship, HouseholdID, ResidentStatus, InhabitantType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)`,
        [
          data.firstName,
          data.middleName ?? null,
          data.lastName,
          data.sex,
          data.dateOfBirth,
          data.placeOfBirth,
          data.civilStatus,
          data.citizenship,
          householdId,
          data.inhabitantType,
        ],
      );

      const residentId = Number(residentResult.insertId);

      await conn.commit();
      return residentId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  //Get All Residents
  static async getAllResidents() {
    const conn = await pool.getConnection();

    try {
      const rows = await conn.query(
        `SELECT r.ResidentID, r.FirstName, r.LastName, r.Sex, r.ResidentStatus, h.HouseholdID FROM Resident r LEFT JOIN Household h ON r.HouseholdID = h.HouseholdID WHERE r.ResidentStatus = 'Active' ORDER BY r.LastName`,
      );

      return rows;
    } finally {
      conn.release();
    }
  }

  //Get Resident By ID
  static async getResidentById(id: number) {
    const conn = await pool.getConnection();

    try {
      const rows = await conn.query(
        `SELECT
        r.ResidentID,
        r.FirstName,
        r.LastName,
        r.HouseholdID AS residentHouseholdId,
        h.HouseholdID AS householdId
        FROM Resident r
        LEFT JOIN Household h ON r.HouseholdID = h.HouseholdID
        WHERE r.ResidentID = ?`,
        [id],
      );

      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  //Update Resident
  static async updateResident(id: number, data: any) {
    const conn = await pool.getConnection();

    try {
      const result = await conn.query(
        `UPDATE Resident SET FirstName = ?, MiddleName = ?, LastName = ?, Sex = ?, CivilStatus = ?, ResidentStatus = ? WHERE ResidentID = ?`,
        [
          data.firstName,
          data.middleName ?? null,
          data.lastName,
          data.sex,
          data.civilStatus,
          data.residentStatus,
          id,
        ],
      );

      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  //Search Residents
  static async searchResidents(filters: any) {
    const conn = await pool.getConnection();

    try {
      let sql = `SELECT ResidentID, FirstName, LastName, Sex, CivilStatus FROM Resident WHERE 1=1`;
      const params: any[] = [];

      if (filters.name) {
        sql += " AND LastName LIKE ?";
        params.push(`%${filters.name}%`);
      }

      if (filters.sex) {
        sql += " AND Sex = ?";
        params.push(filters.sex);
      }

      if (filters.civilStatus) {
        sql += " AND CivilStatus = ?";
        params.push(filters.civilStatus);
      }

      return await conn.query(sql, params);
    } finally {
      conn.release();
    }
  }

  //Get all archived (Deceased/MovedOut) residents
  static async getArchivedResidents() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT r.ResidentID, r.FirstName, r.LastName, r.Sex, r.ResidentStatus, 
                d.DateofDeath
         FROM Resident r
         LEFT JOIN Deceased d ON r.ResidentID = d.ResidentID
         WHERE r.ResidentStatus IN ('Deceased', 'MovedOut')
         ORDER BY r.LastName`
      );
      return rows;
    } finally {
      conn.release();
    }
  }
}
