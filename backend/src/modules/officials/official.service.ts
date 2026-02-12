import { OfficialRepository } from "./official.repository.js";
import { ResidentRepository } from "../residents/resident.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

const VALID_POSITIONS = [
    "Barangay Captain", "Kagawad", "Secretary", "Treasurer",
    "SK Chairperson", "Clerk", "Tanod", "BHW", "Others"
];

const VALID_STATUSES = ["Active", "Inactive", "Former"];

export class OfficialService {

    //Get all officials
    static async getAllOfficials() {
        return OfficialRepository.getAll();
    }

    //Get official by ID
    static async getOfficialById(officialId: number) {
        const official = await OfficialRepository.getById(officialId);
        if (!official) {
            throw { status: 404, message: "Official not found!" };
        }
        return official;
    }

    //Add new official
    static async addOfficial(
        data: {
            residentId: number;
            position: string;
            termStart: string;
            termEnd: string | null;
        },
        userId: number
    ) {
        //Validate resident exists
        const resident = await ResidentRepository.getResidentById(data.residentId);
        if (!resident) {
            throw { status: 404, message: "Resident not found!" };
        }

        //Validate position matches schema ENUM
        if (!VALID_POSITIONS.includes(data.position)) {
            throw { status: 400, message: "Invalid position!" };
        }

        //Check if resident is already an active official
        const isAlready = await OfficialRepository.isActiveOfficial(data.residentId);
        if (isAlready) {
            throw { status: 400, message: "Resident is already an active official!" };
        }

        const officialId = await OfficialRepository.create(data);

        //Audit log
        await AuditTrailRepository.log({
            userId,
            action: "ADD_OFFICIAL",
            newValue: JSON.stringify({ officialId, ...data })
        });

        return officialId;
    }

    //Update official
    static async updateOfficial(
        officialId: number,
        data: {
            position?: string;
            termStart?: string;
            termEnd?: string | null;
            bStatus?: string;
        },
        userId: number
    ) {
        //Validate official exists
        const existing = await OfficialRepository.getById(officialId);
        if (!existing) {
            throw { status: 404, message: "Official not found!" };
        }

        //Validate position if provided
        if (data.position && !VALID_POSITIONS.includes(data.position)) {
            throw { status: 400, message: "Invalid position!" };
        }

        //Validate status if provided
        if (data.bStatus && !VALID_STATUSES.includes(data.bStatus)) {
            throw { status: 400, message: "Invalid status!" };
        }

        const updated = await OfficialRepository.update(officialId, {
            position: data.position ?? existing.Position,
            termStart: data.termStart ?? existing.TermStart,
            termEnd: data.termEnd !== undefined ? data.termEnd : existing.TermEnd,
            bStatus: data.bStatus ?? existing.BStatus
        });

        if (!updated) {
            throw { status: 400, message: "No changes applied!" };
        }

        //Audit log
        await AuditTrailRepository.log({
            userId,
            action: "UPDATE_OFFICIAL",
            oldValue: JSON.stringify({ officialId, previous: existing }),
            newValue: JSON.stringify({ officialId, ...data })
        });

        return true;
    }
}