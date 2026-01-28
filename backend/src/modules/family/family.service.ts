import { FamilyRepository } from "./family.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export class FamilyService {

    //Assign initial household head
    static async assignHouseholdHead(householdId: number, residentId: number, userId: number) {
        const existingHead = await FamilyRepository.getPrimaryHeadByHousehold(householdId);

        if (existingHead) {
            throw {
                status: 400,
                message: "Household already has a primary head!"
            };
        }

        await FamilyRepository.assignPrimaryHead(householdId, residentId);

        await AuditTrailRepository.log({
            userId,
            action: "ASSIGN_FAMILY_HEAD",
            newValue: JSON.stringify({ householdId, residentId })
        });
    }

    //Add family member
    static async addFamilyMember(familyHeadId: number, residentId: number, relationship: string, userId: number) {
        if (!relationship) {
            throw {
                status: 400,
                message: "Relationship to family head is required!"
            };
        }

        await FamilyRepository.addFamilyMember(familyHeadId, residentId, relationship);

        await AuditTrailRepository.log({
            userId,
            action: "ADD_FAMILY_MEMBER",
            newValue: JSON.stringify({ familyHeadId, residentId, relationship })
        });
    }

    //Change household head
    static async changeHouseholdHead(householdId: number, currentHeadId: number, userId: number) {
        const eligible = await FamilyRepository.getEligibleNextOldest(householdId, currentHeadId);

        if (!eligible.length) {
            throw {
                status: 400,
                message: "No eligible next-oldest member found!"
            };
        }

        //Next oldest = first result (ordered by DOB ASC)
        const nextOldest = eligible[0];

        await FamilyRepository.replaceFamilyHead(currentHeadId, nextOldest.ResidentID, householdId);

        await AuditTrailRepository.log({
            userId,
            action: "CHANGE_FAMILY_HEAD",
            newValue: JSON.stringify({ householdId, currentHeadId, nextOldest })
        });
    }

    //View family by household
    static async getFamilyByHousehold(householdId: number) {
        return await FamilyRepository.getFamilyByHousehold(householdId);
    }
}