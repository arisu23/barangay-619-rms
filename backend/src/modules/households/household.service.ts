import { HouseholdRepository } from "./household.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export class HouseholdService {
  static async createHousehold(data: any, userId: number) {
    if (!data.addressId) {
      throw { status: 400, message: "Address is required!" };
    }

    const householdId = await HouseholdRepository.createHousehold(data);

    await AuditTrailRepository.log({
      userId,
      action: "CREATE_HOUSEHOLD",
      newValue: JSON.stringify({ householdId }),
    });

    return householdId;
  }

  static async updateHouseholdNumber(
    houseId: number,
    status: "Available" | "Assigned" | "Inactive",
    userId: number,
  ) {
    if (!["Available", "Assigned", "Inactive"].includes(status)) {
      throw { status: 400, message: "Invalid household status!" };
    }

    const updated = await HouseholdRepository.updateHouseholdNumberStatus(
      houseId,
      status,
    );

    if (!updated) {
      throw { status: 404, message: "Household number not found!" };
    }

    await AuditTrailRepository.log({
      userId,
      action: "UPDATE_HOUSEHOLD_STATUS",
      newValue: JSON.stringify({ houseId, status }),
    });

    return true;
  }

  static async getHouseholdById(householdId: number) {
    const household = await HouseholdRepository.getHouseholdById(householdId);

    if (!household) {
      throw { status: 404, message: "Household not found!" };
    }

    return household;
  }

  static async getAllHouseholds() {
    return HouseholdRepository.getAllHouseholds();
  }

  static async updateHousehold(householdId: number, data: any, userId: number) {
    const existing = await HouseholdRepository.getHouseholdById(householdId);
    if (!existing) {
      throw { status: 404, message: "Household not found!" };
    }
    const updated = await HouseholdRepository.updateHousehold(householdId, data);
    if (!updated) {
      throw { status: 400, message: "No changes applied!" };
    }
    await AuditTrailRepository.log({
      userId,
      action: "UPDATE_HOUSEHOLD",
      oldValue: JSON.stringify({ householdId }),
      newValue: JSON.stringify(data)
    });
    return true;
  }

  static async getAllHouseholdNumbers() {
    return HouseholdRepository.getAllHouseholdNumbers();
  }
  
  static async createHouseholdNumber(data: { householdNumberName: string; addressId?: number }, userId: number) {
    if (!data.householdNumberName) {
      throw { status: 400, message: "Household number name is required!" };
    }
    const houseId = await HouseholdRepository.createHouseholdNumber(data);
    await AuditTrailRepository.log({
      userId,
      action: "CREATE_HOUSEHOLD_NUMBER",
      newValue: JSON.stringify({ houseId, ...data })
    });
    return houseId;
  }
}
