import { pool } from "../../config/database.js";

export class FamilyRepository {
    //Check if household already has a primary head
    static async getPrimaryHeadByHousehold(householdId: number) {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT * FROM FamilyHead WHERE HouseholdID = ? AND HeadType = 'Primary'`,
                [householdId]
            );

            return rows[0] ?? null;
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
                [householdId, residentId]
            );
        } finally {
            conn.release();
        }
    }

    //Add family member
    static async addFamilyMember(familyHeadId: number, residentId: number, relationship: string) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                `INSERT INTO Family (FamilyHeadID, ResidentID, RelationshipToFamilyHead) VALUES (?, ?, ?)`,
                [familyHeadId, residentId, relationship]
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
                `SELECT fh.FamilyHeadID, fh.HeadType, r.ResidentID, r.FirstName, r.LastName, r.DateOfBirth, f.RelationshipToFamilyHead FROM FamilyHead fh JOIN Resident r ON fh.ResidentID = r.ResidentID LEFT JOIN Family f ON fh.FamilyHeadID = f.FamilyHeadID WHERE fh.HouseholdID = ?`,
                [householdId]
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
                [household, currentHeadId]
            );
        } finally {
            conn.release();
        }
    }

    //Replace family head
    static async replaceFamilyHead(oldHeadId: number, newResidentId: number, householdId: number) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            //Demote old head
            await conn.query(
                `UPDATE FamilyHead SET HeadType = 'Secondary' WHERE FamilyHeadID = ?`,
                [oldHeadId]
            );

            //Assign new primary head
            await conn.query(
                `INSERT INTO FamilyHead (HouseholdID, ResidentID, HeadType) VALUES (?, ?, 'Primary')`,
                [householdId, newResidentId]
            );

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}