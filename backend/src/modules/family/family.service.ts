import { FamilyRepository } from "./family.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export class FamilyService {
  //Assign initial household head
  static async assignHouseholdHead(
    householdId: number,
    residentId: number,
    userId: number,
  ) {
    if (!Number.isInteger(householdId) || householdId <= 0) {
      throw {
        status: 400,
        message: "Invalid household ID!",
      };
    }

    if (!Number.isInteger(residentId) || residentId <= 0) {
      throw {
        status: 400,
        message: "Invalid resident ID!",
      };
    }

    const existingHead =
      await FamilyRepository.getPrimaryHeadByHousehold(householdId);

    if (existingHead) {
      throw {
        status: 400,
        message: "Household already has a primary head!",
      };
    }

    await FamilyRepository.assignPrimaryHead(householdId, residentId);

    await AuditTrailRepository.log({
      userId,
      action: "ASSIGN_FAMILY_HEAD",
      newValue: JSON.stringify({ householdId, residentId }),
    });
  }

  //Add family member
  static async addFamilyMember(
    familyHeadId: number,
    residentId: number,
    relationship: string,
    userId: number,
  ) {
    if (!Number.isInteger(familyHeadId) || familyHeadId <= 0) {
      throw {
        status: 400,
        message: "Invalid family head ID!",
      };
    }

    if (!Number.isInteger(residentId) || residentId <= 0) {
      throw {
        status: 400,
        message: "Invalid resident ID!",
      };
    }

    const cleanedRelationship =
      typeof relationship === "string" ? relationship.trim() : "";

    if (!cleanedRelationship) {
      throw {
        status: 400,
        message: "Relationship to family head is required!",
      };
    }

    await FamilyRepository.addFamilyMember(
      familyHeadId,
      residentId,
      cleanedRelationship,
    );

    await AuditTrailRepository.log({
      userId,
      action: "ADD_FAMILY_MEMBER",
      newValue: JSON.stringify({
        familyHeadId,
        residentId,
        relationship: cleanedRelationship,
      }),
    });
  }

  //Change household head
  static async changeHouseholdHead(
    householdId: number,
    currentHeadId: number,
    userId: number,
  ) {
    if (!Number.isInteger(householdId) || householdId <= 0) {
      throw {
        status: 400,
        message: "Invalid household ID!",
      };
    }

    if (!Number.isInteger(currentHeadId) || currentHeadId <= 0) {
      throw {
        status: 400,
        message: "Invalid current head ID!",
      };
    }

    const currentHead = await FamilyRepository.getFamilyHeadById(currentHeadId);

    if (!currentHead || Number(currentHead.HouseholdID) !== householdId) {
      throw {
        status: 404,
        message: "Current household head not found!",
      };
    }

    const currentHeadResidentId = Number(currentHead.ResidentID);
    const eligible = await FamilyRepository.getEligibleNextOldest(
      householdId,
      currentHeadResidentId,
    );

    if (!eligible.length) {
      throw {
        status: 400,
        message: "No eligible next-oldest member found!",
      };
    }

    //Next oldest = first result (ordered by DOB ASC)
    const nextOldest = eligible[0];
    const nextOldestResidentId = Number(nextOldest.ResidentID);

    await FamilyRepository.replaceFamilyHead(
      currentHeadId,
      nextOldestResidentId,
      householdId,
    );

    await AuditTrailRepository.log({
      userId,
      action: "CHANGE_FAMILY_HEAD",
      newValue: JSON.stringify({
        householdId,
        currentHeadId,
        previousHeadResidentId: currentHeadResidentId,
        nextOldestResidentId,
      }),
    });
  }

  //View family by household
  static async getFamilyByHousehold(householdId: number) {
    return await FamilyRepository.getFamilyByHousehold(householdId);
  }
}
