import api from "./api";

export interface OfficialApi {
  OfficialID: number;
  ResidentID: number;
  FirstName: string;
  LastName: string;
  Position: string;
  TermStart: string;
  TermEnd: string | null;
  BStatus: "Active" | "Inactive" | "Former";
}

export interface CreateOfficialPayload {
  residentId: number;
  position: string;
  termStart: string;
  termEnd?: string | null;
}

export interface UpdateOfficialPayload {
  position?: string;
  termStart?: string;
  termEnd?: string | null;
  bStatus?: "Active" | "Inactive" | "Former";
}

export const officialService = {
  async getAll(): Promise<OfficialApi[]> {
    const response = await api.get("/officials");
    return response.data.data;
  },

  async create(data: CreateOfficialPayload): Promise<{ officialId: number }> {
    const response = await api.post("/officials", data);
    return response.data.data;
  },

  async update(id: number, data: UpdateOfficialPayload): Promise<void> {
    await api.put(`/officials/${id}`, data);
  },
};
