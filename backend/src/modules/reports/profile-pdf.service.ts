import PDFDocument from "pdfkit";
import type { Response } from "express";

// ═══════════════════════════════════════════════
//  Profile PDF Service (FR4)
//  Generates standardized resident profile PDFs
//  Filename format: LastName_FirstName_MI.pdf
// ═══════════════════════════════════════════════

export class ProfilePdfService {

    /**
     * Build filename per FR4 spec: Ln_Fn_MI.pdf
     */
    static buildFilename(resident: any): string {
        const ln = (resident.LastName || "Unknown").replace(/\s+/g, "");
        const fn = (resident.FirstName || "Unknown").replace(/\s+/g, "");
        const mi = resident.MiddleName
            ? resident.MiddleName.charAt(0).toUpperCase()
            : "";
        return mi ? `${ln}_${fn}_${mi}.pdf` : `${ln}_${fn}.pdf`;
    }

    /**
     * Stream a PDF to the HTTP response
     */
    static generate(resident: any, res: Response): void {
        const filename = this.buildFilename(resident);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        const doc = new PDFDocument({ size: "LETTER", margin: 50 });
        doc.pipe(res);

        // ── Header ────────────────────────────
        this.drawHeader(doc);

        // ── Personal Information ──────────────
        this.drawSection(doc, "PERSONAL INFORMATION", [
            ["Full Name", this.fullName(resident)],
            ["Sex", resident.Sex || "—"],
            ["Date of Birth", this.fmtDate(resident.DateOfBirth)],
            ["Age", resident.Age != null ? String(resident.Age) : "—"],
            ["Place of Birth", resident.PlaceOfBirth || "—"],
            ["Civil Status", resident.CivilStatus || "—"],
            ["Citizenship", resident.Citizenship || "—"],
            ["Religion", resident.Religion || "—"],
            ["Inhabitant Type", resident.InhabitantType || "—"],
            ["Status", resident.ResidentStatus || "—"],
        ]);

        // ── Contact ──────────────────────────
        this.drawSection(doc, "CONTACT INFORMATION", [
            ["Contact Number", resident.RContactNumber || "—"],
            ["Email", resident.REmail || "—"],
        ]);

        // ── Address ──────────────────────────
        this.drawSection(doc, "ADDRESS", [
            ["House No.", resident.HouseNumber || "—"],
            ["Street / Alley / Zone", resident.Street_Alley_Zone || "—"],
            ["Barangay", resident.Barangay || "—"],
            ["Municipality", resident.Municipality || "—"],
            ["Unit / Room / Floor", resident.Unit_RoomNo_Floor || "—"],
            ["Building Name", resident.Building_Name || "—"],
            ["Lot / Block / Phase", resident.Lot_Block_Phase_Num || "—"],
            ["Household No.", resident.HouseholdNumberName || "—"],
        ]);

        // ── Mother's Maiden Name ─────────────
        const motherName = [
            resident.Mothers_Maiden_FirstName,
            resident.Mothers_Maiden_MiddleName,
            resident.Mothers_Maiden_Surname,
        ]
            .filter(Boolean)
            .join(" ");
        if (motherName) {
            this.drawSection(doc, "MOTHER'S MAIDEN NAME", [
                ["Name", motherName],
            ]);
        }

        // ── Employment ───────────────────────
        this.drawSection(doc, "EMPLOYMENT", [
            ["Status", resident.EmploymentStatus || "—"],
            ["Occupation", resident.Occupation || "—"],
        ]);

        // ── Education ────────────────────────
        this.drawSection(doc, "EDUCATION", [
            ["Level", resident.EducationLevel || "—"],
            ["Education Status", resident.EducationStatus || "—"],
        ]);

        // ── Voter ────────────────────────────
        this.drawSection(doc, "VOTER INFORMATION", [
            [
                "Registered Voter",
                resident.VoterID ? "Yes" : "No",
            ],
            ["Precinct Number", resident.PrecinctNumber || "—"],
        ]);

        // ── Special Categories ───────────────
        if (resident.Categories) {
            this.drawSection(doc, "SPECIAL CATEGORIES", [
                ["Categories", resident.Categories],
            ]);
        }

        // ── Footer ───────────────────────────
        this.drawFooter(doc);

        doc.end();
    }

    // ══════════════════════════════════════════
    //  Private helpers
    // ══════════════════════════════════════════

    private static fullName(r: any): string {
        return [r.LastName, r.FirstName, r.MiddleName, r.Suffix]
            .filter(Boolean)
            .join(", ");
    }

    private static fmtDate(d: any): string {
        if (!d) return "—";
        const dt = new Date(d);
        return dt.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    private static drawHeader(doc: PDFKit.PDFDocument): void {
        doc.fontSize(10)
            .font("Helvetica")
            .text("Republic of the Philippines", { align: "center" })
            .text("City of Manila", { align: "center" })
            .moveDown(0.3);

        doc.fontSize(16)
            .font("Helvetica-Bold")
            .text("BARANGAY 619", { align: "center" });

        doc.fontSize(10)
            .font("Helvetica")
            .text("Zone 62, District VI", { align: "center" })
            .moveDown(0.5);

        doc.fontSize(14)
            .font("Helvetica-Bold")
            .text("RESIDENT PROFILE", { align: "center" })
            .moveDown(0.3);

        // Decorative line
        const lineY = doc.y;
        doc.moveTo(50, lineY)
            .lineTo(562, lineY)
            .strokeColor("#16a34a")
            .lineWidth(2)
            .stroke();

        doc.moveDown(0.8);
    }

    private static drawSection(
        doc: PDFKit.PDFDocument,
        title: string,
        rows: [string, string][]
    ): void {
        // Check if we need a new page (leave 120pt margin)
        if (doc.y > 650) {
            doc.addPage();
        }

        doc.fontSize(11)
            .font("Helvetica-Bold")
            .fillColor("#16a34a")
            .text(title)
            .moveDown(0.2);

        // Thin separator
        const sepY = doc.y;
        doc.moveTo(50, sepY)
            .lineTo(562, sepY)
            .strokeColor("#d1d5db")
            .lineWidth(0.5)
            .stroke();

        doc.moveDown(0.3);

        for (const [label, value] of rows) {
            if (value === "—" || !value) {
                // Skip empty optional fields to save space
                continue;
            }
            const startY = doc.y;
            doc.fontSize(9)
                .font("Helvetica-Bold")
                .fillColor("#374151")
                .text(`${label}:`, 70, startY, { width: 150, continued: false });
            doc.fontSize(9)
                .font("Helvetica")
                .fillColor("#111827")
                .text(value, 220, startY, { width: 330 });
            doc.moveDown(0.15);
        }

        doc.moveDown(0.6);
    }

    private static drawFooter(doc: PDFKit.PDFDocument): void {
        doc.moveDown(2);

        const footerY = doc.y;

        // Timestamp
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        doc.fontSize(8)
            .font("Helvetica")
            .fillColor("#6b7280")
            .text(`Generated on ${dateStr}`, 50, footerY, { align: "left" })
            .text("Barangay 619 Resident Management System", 50, footerY, {
                align: "right",
            });
    }
}
