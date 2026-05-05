import api from "./api";
import type { ArchivedResident, ResidentHistoryEntry } from "../types";

export const archiveService = {
  async archiveResident(
    residentId: number,
    payload: { status: "Deceased" | "MovedOut"; dateOfDeath?: string },
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/archives/${residentId}`, payload);
    return response.data;
  },

  async getArchivedResidents(): Promise<ArchivedResident[]> {
    const response = await api.get("/archives");
    return response.data.data;
  },

  async restoreResident(
    residentId: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/archives/${residentId}/restore`);
    return response.data;
  },

  async getResidentHistory(
    residentId: number,
  ): Promise<ResidentHistoryEntry[]> {
    const response = await api.get(`/archives/history/${residentId}`);
    return response.data.data;
  },
};
