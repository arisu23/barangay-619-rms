import { pool } from "../../config/database.js";

export class ResidentArchiveRepository {
    
    //Archive resident
    static async archiveResident(
        residentId: number,
        status: "Deceased" | "MovedOut",
        dateOfDeath: string | null,
        userId: number
    ) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            //Update resident status
            await conn.query(
                `UPDATE Resident SET ResidentStatus = ? WHERE ResidentID = ?`,
                [status, residentId]
            );

            //Insert into Deceased table if applicable
            if (status === "Deceased" && dateOfDeath) {
                await conn.query(
                    `INSERT INTO Deceased (ResidentID, DateOfDeath) VALUES (?, ?)`,
                    [residentId, dateOfDeath]
                );
            }

            //Insert resident history
            await conn.query(
                `INSERT INTO ResidentHistory (ResidentID, ChangeType, ChangeDate, UserID) VALUES (?, ?, CURDATE(), ?)`,
                [residentId, status, userId]
            );
            
            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    //Restore archived resident back to Active
    static async restoreResident(
        residentId: number,
        userId: number
    ) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            //Restore resident status
            await conn.query(
                `UPDATE Resident SET ResidentStatus = 'Active' WHERE ResidentID = ?`,
                [residentId]
            );

            //Log restoration in history
            await conn.query(
                `INSERT INTO ResidentHistory (ResidentID, ChangeType, ChangeDate, UserID) VALUES (?, 'Returned', CURDATE(), ?)`,
                [residentId, userId]
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