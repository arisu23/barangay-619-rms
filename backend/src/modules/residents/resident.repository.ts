import { pool } from "../../config/database.js";

export class ResidentRepository {
  static async createResident(data: any) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      //Add Address fields
      const addressResult = await conn.query(
        `INSERT INTO Address (
          Unit_RoomNo_Floor, 
          Building_Name, 
          Lot_Block_Phase_Num, 
          HouseNumber, 
          Street_Alley_Zone, 
          Barangay, 
          Municipality
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.address?.unitRoomFloor ?? null,
          data.address?.buildingName ?? null,
          data.address?.lotBlockPhase ?? null,
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

      //Add Resident (all schema fields)
      const residentResult = await conn.query(
        `INSERT INTO Resident (
          FirstName, 
          MiddleName, 
          LastName, 
          Suffix,
          Sex, 
          DateOfBirth, 
          PlaceOfBirth, 
          CivilStatus, 
          Citizenship, 
          Religion,
          HouseholdID, 
          ResidentStatus, 
          RContactNumber,
          REmail,
          InhabitantType,
          Mothers_Maiden_Surname,
          Mothers_Maiden_FirstName,
          Mothers_Maiden_MiddleName
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, ?, ?, ?, ?)`,
        [
          data.firstName,
          data.middleName ?? null,
          data.lastName,
          data.suffix ?? null,
          data.sex,
          data.dateOfBirth,
          data.placeOfBirth,
          data.civilStatus,
          data.citizenship,
          data.religion ?? null,
          householdId,
          data.contactNumber ?? null,
          data.email ?? null,
          data.inhabitantType,
          data.mothersMaidenSurname ?? null,
          data.mothersMaidenFirstName ?? null,
          data.mothersMaidenMiddleName ?? null,
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

  //Get Resident By ID (all fields)
  static async getResidentById(id: number) {
    const conn = await pool.getConnection();

    try {
      const rows = await conn.query(
        `SELECT
          r.ResidentID,
          r.FirstName,
          r.MiddleName,
          r.LastName,
          r.Suffix,
          r.Sex,
          r.DateOfBirth,
          r.PlaceOfBirth,
          r.CivilStatus,
          r.Citizenship,
          r.Religion,
          r.RContactNumber,
          r.REmail,
          r.InhabitantType,
          r.ResidentStatus,
          r.Mothers_Maiden_Surname,
          r.Mothers_Maiden_FirstName,
          r.Mothers_Maiden_MiddleName,
          r.HouseholdID,
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

  //Update Resident (all editable fields)
  static async updateResident(id: number, data: any) {
    const conn = await pool.getConnection();

    try {
      const result = await conn.query(
        `UPDATE Resident SET 
          FirstName = ?, 
          MiddleName = ?, 
          LastName = ?, 
          Suffix = ?,
          Sex = ?, 
          CivilStatus = ?, 
          Religion = ?,
          RContactNumber = ?,
          REmail = ?,
          ResidentStatus = ?,
          Mothers_Maiden_Surname = ?,
          Mothers_Maiden_FirstName = ?,
          Mothers_Maiden_MiddleName = ?
        WHERE ResidentID = ?`,
        [
          data.firstName,
          data.middleName ?? null,
          data.lastName,
          data.suffix ?? null,
          data.sex,
          data.civilStatus,
          data.religion ?? null,
          data.contactNumber ?? null,
          data.email ?? null,
          data.residentStatus,
          data.mothersMaidenSurname ?? null,
          data.mothersMaidenFirstName ?? null,
          data.mothersMaidenMiddleName ?? null,
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
      let sql = `SELECT r.ResidentID, r.FirstName, r.LastName, r.Sex, r.CivilStatus, r.ResidentStatus, r.HouseholdID 
                 FROM Resident r WHERE 1=1`;
      const params: any[] = [];

      //Search by name (FirstName OR LastName)
      if (filters.name) {
        sql += " AND (r.FirstName LIKE ? OR r.LastName LIKE ?)";
        params.push(`%${filters.name}%`, `%${filters.name}%`);
      }

      //Filter by sex
      if (filters.sex) {
        sql += " AND r.Sex = ?";
        params.push(filters.sex);
      }

      //Filter by civil status
      if (filters.civilStatus) {
        sql += " AND r.CivilStatus = ?";
        params.push(filters.civilStatus);
      }

      //Filter by resident status (Active, MovedOut, Deceased)
      if (filters.status) {
        sql += " AND r.ResidentStatus = ?";
        params.push(filters.status);
      }

      //Filter by household
      if (filters.householdId) {
        sql += " AND r.HouseholdID = ?";
        params.push(Number(filters.householdId));
      }

      //Filter by inhabitant type
      if (filters.inhabitantType) {
        sql += " AND r.InhabitantType = ?";
        params.push(filters.inhabitantType);
      }

      sql += " ORDER BY r.LastName ASC";

      return await conn.query(sql, params);
    } finally {
      conn.release();
    }
  }

  //Check for duplicate resident
  static async findDuplicate(firstName: string, lastName: string, dateOfBirth: string): Promise<any> {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT ResidentID, FirstName, LastName, DateOfBirth, ResidentStatus FROM Resident WHERE FirstName = ? AND LastName = ? AND DateOfBirth = ?`,
        [firstName, lastName, dateOfBirth]
      );
      return rows[0] || null;
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
