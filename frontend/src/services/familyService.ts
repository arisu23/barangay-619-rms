import api from "./api";
import type { FamilyRecord, FamilyHeadOption } from "../types";

export const familyService = {
  /** Get all family records for a household */
  async getByHousehold(householdId: number): Promise<FamilyRecord[]> {
    const response = await api.get(`/families/household/${householdId}`);
    return response.data.data;
  },

  /** Get all primary family heads */
  async getPrimaryHeads(): Promise<FamilyHeadOption[]> {
    const response = await api.get("/families/heads");
    const raw: Array<{
      FamilyHeadID: number;
      HouseholdID: number;
      FirstName: string;
      LastName: string;
      HouseholdNumber: string;
      Street_Alley_Zone: string;
      FamilyLabel?: string | null;
    }> = response.data.data;

    return raw.map((head) => ({
      id: String(head.FamilyHeadID),
      name: `${head.LastName}, ${head.FirstName}`,
      householdId: Number(head.HouseholdID),
      householdNumber: head.HouseholdNumber,
      street: head.Street_Alley_Zone,
      familyLabel: head.FamilyLabel || "Family",
    }));
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

  /** Demote a primary family head and auto-assign a new head */
  async demoteHead(residentId: number): Promise<void> {
    await api.post("/families/demote-head", { residentId });
  },
};
