import { ResidentRepository } from "./resident.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export class ResidentService {
  static async createResident(data: any, userId: number) {
    //Resident data validation
    if (!data.firstName || !data.lastName || !data.sex) {
      throw { status: 400, message: "Missing required resident fields!" };
    }

    const residentId = await ResidentRepository.createResident(data);

    //Audit Log
    await AuditTrailRepository.log({
      userId,
      action: "CREATE_RESIDENT",
      newValue: JSON.stringify({
        residentId,
        name: `${data.firstName} ${data.lastName}`,
      }),
    });

    return residentId;
  }

  static async getAllResidents() {
    return ResidentRepository.getAllResidents();
  }

  static async getResidentById(id: number) {
    const resident = await ResidentRepository.getResidentById(id);

    if (!resident) {
      throw { status: 404, message: "Resident not found!" };
    }

    return resident;
  }

  static async updateResident(id: number, data: any, userId: number) {
    const existing = await ResidentRepository.getResidentById(id);

    if (!existing) {
      throw { status: 404, message: "Resident not found!" };
    }

    // ! Example Rule
    if (
      data.residentStatus &&
      !["Active", "MovedOut", "Deceased"].includes(data.residentStatus)
    ) {
      throw { status: 400, message: "Invalid resident status!" };
    }

    const updated = await ResidentRepository.updateResident(id, data);

    if (!updated) {
      throw { status: 400, message: "No changes applied!" };
    }

    await AuditTrailRepository.log({
      userId,
      action: "UPDATE_RESIDENT",
      oldValue: JSON.stringify({ id }),
      newValue: JSON.stringify(data),
    });

    return true;
  }

  static async searchResidents(filters: any) {
    if (!filters || Object.keys(filters).length === 0) {
      throw { status: 400, message: "Search filters required!" };
    }

    return ResidentRepository.searchResidents(filters);
  }
}
