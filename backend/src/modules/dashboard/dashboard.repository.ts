import { pool } from "../../config/database.js";

export class DashboardRepository {
    // STAT CARDS - Matches the 6 StatCard components
    //Total active population
    static async getTotalPopulation(): Promise<number> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT COUNT(*) as count FROM Resident WHERE ResidentStatus = 'Active'`
            );
            return rows[0]?.count || 0;
        } finally {
            conn.release();
        }
    }

    //Registered voters (from Voter table joined with active residents)
    static async getRegisteredVoters(): Promise<number> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT COUNT(*) as count FROM Voter v 
                JOIN Resident r ON v.ResidentID = r.ResidentID 
                WHERE r.ResidentStatus = 'Active'`
            );
            return rows[0]?.count || 0;
        } finally {
            conn.release();
        }
    }

    //Gender count (Male/Female)
    static async getGenderCount(): Promise<{ male: number; female: number }> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT Sex, COUNT(*) as count FROM Resident 
                WHERE ResidentStatus = 'Active' 
                GROUP BY Sex`
            );
            let male = 0, female = 0;
            for (const row of rows) {
                if (row.Sex === "Male") male = row.count;
                if (row.Sex === "Female") female = row.count;
            }
            return { male, female };
        } finally {
            conn.release();
        }
    }

    //Total households
    static async getTotalHouseholds(): Promise<number> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT COUNT(*) as count FROM Household`
            );
            return rows[0]?.count || 0;
        } finally {
            conn.release();
        }
    }

    //Total families (count of family heads)
    static async getTotalFamilies(): Promise<number> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT COUNT(*) as count FROM FamilyHead`
            );
            return rows[0]?.count || 0;
        } finally {
            conn.release();
        }
    }

    // PIE CHART - "Resident Classification" categories
    //Age-based classifications (Children, Youth, Senior)
    static async getAgeClassification(): Promise<{
        children: number;
        youth: number;
        seniorCitizen: number;
    }> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT 
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 15 THEN 1 ELSE 0 END) as children,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 15 AND 30 THEN 1 ELSE 0 END) as youth,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) >= 60 THEN 1 ELSE 0 END) as seniorCitizen
                FROM Resident
                WHERE ResidentStatus = 'Active'`
            );
            return {
                children: rows[0]?.children || 0,
                youth: rows[0]?.youth || 0,
                seniorCitizen: rows[0]?.seniorCitizen || 0
            };
        } finally {
            conn.release();
        }
    }

    //PWD count (from ResidentCategory + SpecialCategory)
    static async getPWDCount(): Promise<number> {
        const conn = await pool.getConnection();
        try {
            const rows = await conn.query(
                `SELECT COUNT(DISTINCT rc.ResidentID) as count 
                FROM ResidentCategory rc
                JOIN SpecialCategory sc ON rc.CategoryID = sc.CategoryID
                JOIN Resident r ON rc.ResidentID = r.ResidentID
                WHERE sc.CategoryName = 'PWD' AND r.ResidentStatus = 'Active'`
            );
            return rows[0]?.count || 0;
        } finally {
            conn.release();
        }
    }

    //Employment count
    static async getEmploymentCount(): Promise<{ employed: number; unemployed: number }> {
        const conn = await pool.getConnection();
        try {
            //Count residents with employment records (Employed or Self-Employed)
            const employedRows = await conn.query(
                `SELECT COUNT(DISTINCT e.ResidentID) as count 
                FROM Employment e
                JOIN Resident r ON e.ResidentID = r.ResidentID
                WHERE e.EmploymentStatus IN ('Employed', 'Self-Employed') 
                AND r.ResidentStatus = 'Active'`
            );
            const employed = employedRows[0]?.count || 0;

            //Total active population for calculating unemployed
            const totalRows = await conn.query(
                `SELECT COUNT(*) as count FROM Resident WHERE ResidentStatus = 'Active'`
            );
            const total = totalRows[0]?.count || 0;
            const unemployed = total - employed;

            return { employed, unemployed: unemployed > 0 ? unemployed : 0 };
        } finally {
            conn.release();
        }
    }
    
    // LOG CARDS - New, Moved Out, Deceased (Monthly/Yearly)
    //New residents this month/year (from ResidentHistory)
    static async getNewResidents(): Promise<{ monthly: number; yearly: number }> {
        const conn = await pool.getConnection();
        try {
            const monthlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM ResidentHistory 
                WHERE ChangeType = 'New' 
                AND MONTH(ChangeDate) = MONTH(CURDATE()) 
                AND YEAR(ChangeDate) = YEAR(CURDATE())`
            );
            const yearlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM ResidentHistory 
                WHERE ChangeType = 'New' 
                AND YEAR(ChangeDate) = YEAR(CURDATE())`
            );
            return {
                monthly: monthlyRows[0]?.count || 0,
                yearly: yearlyRows[0]?.count || 0
            };
        } finally {
            conn.release();
        }
    }

    //Moved out residents this month/year
    static async getMovedOutResidents(): Promise<{ monthly: number; yearly: number }> {
        const conn = await pool.getConnection();
        try {
            const monthlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM ResidentHistory 
                WHERE ChangeType = 'MovedOut' 
                AND MONTH(ChangeDate) = MONTH(CURDATE()) 
                AND YEAR(ChangeDate) = YEAR(CURDATE())`
            );
            const yearlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM ResidentHistory 
                WHERE ChangeType = 'MovedOut' 
                AND YEAR(ChangeDate) = YEAR(CURDATE())`
            );
            return {
                monthly: monthlyRows[0]?.count || 0,
                yearly: yearlyRows[0]?.count || 0
            };
        } finally {
            conn.release();
        }
    }

    //Deceased residents this month/year
    static async getDeceasedResidents(): Promise<{ monthly: number; yearly: number }> {
        const conn = await pool.getConnection();
        try {
            const monthlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM Deceased 
                WHERE MONTH(DateofDeath) = MONTH(CURDATE()) 
                AND YEAR(DateofDeath) = YEAR(CURDATE())`
            );
            const yearlyRows = await conn.query(
                `SELECT COUNT(*) as count FROM Deceased 
                WHERE YEAR(DateofDeath) = YEAR(CURDATE())`
            );
            return {
                monthly: monthlyRows[0]?.count || 0,
                yearly: yearlyRows[0]?.count || 0
            };
        } finally {
            conn.release();
        }
    }
}