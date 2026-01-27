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
}
