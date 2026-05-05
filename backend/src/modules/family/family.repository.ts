import { pool } from "../../config/database.js";

export class FamilyRepository {
  static async getFamilyHeadById(familyHeadId: number) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT FamilyHeadID, HouseholdID, ResidentID, HeadType
                 FROM FamilyHead
                 WHERE FamilyHeadID = ?
                 LIMIT 1`,
        [familyHeadId],
      );

      return rows[0] ?? null;
    } finally {
      conn.release();
    }
  }

  //Check if household already has a primary head
  static async getPrimaryHeadByHousehold(householdId: number) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT * FROM FamilyHead WHERE HouseholdID = ? AND HeadType = 'Primary'`,
        [householdId],
      );

      return rows[0] ?? null;
    } finally {
      conn.release();
    }
  }

  //Check if a resident is the primary household head
  static async isHouseholdHead(residentId: number): Promise<boolean> {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        `SELECT FamilyHeadID FROM FamilyHead WHERE ResidentID = ? AND HeadType = 'Primary'`,
        [residentId],
      );
      return rows.length > 0;
    } finally {
      conn.release();
    }
  }

  //Assign a primary family head
  static async assignPrimaryHead(householdId: number, residentId: number) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `INSERT INTO FamilyHead (HouseholdID, ResidentID, HeadType) VALUES (?, ?, 'Primary')`,
        [householdId, residentId],
      );
    } finally {
      conn.release();
    }
  }

  //Add family member
  static async addFamilyMember(
    familyHeadId: number,
    residentId: number,
    relationship: string,
  ) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        `INSERT INTO Family (FamilyHeadID, ResidentID, RelationshipToFamilyHead) VALUES (?, ?, ?)`,
        [familyHeadId, residentId, relationship],
      );
    } finally {
      conn.release();
    }
  }

  //Get all family members of a household
  static async getFamilyByHousehold(householdId: number) {
    const conn = await pool.getConnection();
    try {
      return await conn.query(
        `SELECT
           fh.FamilyHeadID,
           fh.HeadType,
           head.ResidentID,
           head.FirstName,
           head.LastName,
           head.DateOfBirth,
           NULL AS RelationshipToFamilyHead
         FROM FamilyHead fh
         JOIN Resident head ON fh.ResidentID = head.ResidentID
         WHERE fh.HouseholdID = ?

         UNION ALL

         SELECT
           fh.FamilyHeadID,
           fh.HeadType,
           member.ResidentID,
           member.FirstName,
           member.LastName,
           member.DateOfBirth,
           f.RelationshipToFamilyHead
         FROM FamilyHead fh
         JOIN Family f ON fh.FamilyHeadID = f.FamilyHeadID
         JOIN Resident member ON f.ResidentID = member.ResidentID
         WHERE fh.HouseholdID = ?

         ORDER BY FamilyHeadID ASC`,
        [householdId, householdId],
      );
    } finally {
      conn.release();
    }
  }

  //Get eligible next-oldest members (excluding current head)
  static async getEligibleNextOldest(household: number, currentHeadId: number) {
    const conn = await pool.getConnection();
    try {
      return await conn.query(
        `SELECT ResidentID, DateOfBirth FROM Resident WHERE HouseholdID = ? AND ResidentID != ? AND ResidentStatus = 'Active' ORDER BY DateOfBirth ASC`,
        [household, currentHeadId],
      );
    } finally {
      conn.release();
    }
  }

  //Replace family head
  static async replaceFamilyHead(
    oldHeadId: number,
    newResidentId: number,
    householdId: number,
  ) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Remove new head from Family table if they are a current member
      //    (prevents duplicate rows in the UNION query)
      await conn.query(
        `DELETE FROM Family WHERE ResidentID = ? AND FamilyHeadID IN (
           SELECT FamilyHeadID FROM FamilyHead WHERE HouseholdID = ?
         )`,
        [newResidentId, householdId],
      );

      // 2. Capture existing Secondary head residents before cleanup
      const existingSecondaryResidents = await conn.query(
        `SELECT ResidentID FROM FamilyHead WHERE HouseholdID = ? AND HeadType = 'Secondary'`,
        [householdId],
      );

      // 3. Re-link Family members from any existing Secondary heads to the current Primary
      await conn.query(
        `UPDATE Family SET FamilyHeadID = ? WHERE FamilyHeadID IN (
           SELECT FamilyHeadID FROM FamilyHead WHERE HouseholdID = ? AND HeadType = 'Secondary'
         )`,
        [oldHeadId, householdId],
      );

      // 4. Delete all existing Secondary FamilyHead rows
      await conn.query(
        `DELETE FROM FamilyHead WHERE HouseholdID = ? AND HeadType = 'Secondary'`,
        [householdId],
      );

      // 5. Demote old Primary head to Secondary
      await conn.query(
        `UPDATE FamilyHead SET HeadType = 'Secondary' WHERE FamilyHeadID = ?`,
        [oldHeadId],
      );

      // 6. Insert new Primary head
      const result = await conn.query(
        `INSERT INTO FamilyHead (HouseholdID, ResidentID, HeadType) VALUES (?, ?, 'Primary')`,
        [householdId, newResidentId],
      );
      const newHeadFamilyHeadId = result.insertId;

      // 7. Add former Secondary head residents as regular family members
      //    under the new Primary head so they remain visible in the family list
      for (const row of existingSecondaryResidents) {
        const residentId = Number(row.ResidentID);
        if (residentId !== newResidentId) {
          await conn.query(
            `INSERT INTO Family (FamilyHeadID, ResidentID, RelationshipToFamilyHead) VALUES (?, ?, 'Relative')`,
            [newHeadFamilyHeadId, residentId],
          );
        }
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
