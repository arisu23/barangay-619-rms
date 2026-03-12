import api from "./api";
import type { FamilyRecord } from "../types";

export const familyService = {
  /** Get all family records for a household */
  async getByHousehold(householdId: number): Promise<FamilyRecord[]> {
    const response = await api.get(`/families/household/${householdId}`);
    return response.data.data;
  },

  /** Assign an initial household head */
  async assignHead(householdId: number, residentId: number): Promise<void> {
    await api.post("/families/head", { householdId, residentId });
  },

  /** Add a family member under a family head */
  async addMember(
    familyHeadId: number,
    residentId: number,
    relationship: string,
  ): Promise<void> {
    await api.post("/families/member", {
      familyHeadId,
      residentId,
      relationship,
    });
  },

  /** Change the household head (auto-selects next oldest) */
  async changeHead(householdId: number, currentHeadId: number): Promise<void> {
    await api.put("/families/change-head", { householdId, currentHeadId });
  },
};
