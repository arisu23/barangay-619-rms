import { pool } from "../../config/database.js";

export class BarangayInfoRepository {

    //Get barangay info (single row)
    static async get() {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT BarangayInfoID, PhoneNum, TelNum, EmailAd, BarangayAddress FROM BarangayInfo LIMIT 1`
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    }

    //Update or insert barangay info
    static async upsert(data: {
        phoneNum: string | null;
        telNum: string | null;
        emailAd: string | null;
        barangayAddress: string | null;
    }) {
        const conn = await pool.getConnection();
        try {
            //Check if record exists
            const existing = await conn.query(`SELECT BarangayInfoID FROM BarangayInfo LIMIT 1`);

            if (existing.length > 0) {
                //Update existing
                await conn.query(
                    `UPDATE BarangayInfo SET PhoneNum = ?, TelNum = ?, EmailAd = ?, BarangayAddress = ? WHERE BarangayInfoID = ?`,
                    [data.phoneNum, data.telNum, data.emailAd, data.barangayAddress, existing[0].BarangayInfoID]
                );
            } else {
                //Insert first record
                await conn.query(
                    `INSERT INTO BarangayInfo (PhoneNum, TelNum, EmailAd, BarangayAddress) VALUES (?, ?, ?, ?)`,
                    [data.phoneNum, data.telNum, data.emailAd, data.barangayAddress]
                );
            }
            return true;
        } finally {
            conn.release();
        }
    }
}