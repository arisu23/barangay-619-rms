import api from "./api";

export interface BarangayInfoApi {
  BarangayInfoID: number;
  PhoneNum: string | null;
  TelNum: string | null;
  EmailAd: string | null;
  BarangayAddress: string | null;
}

export interface UpdateBarangayInfoPayload {
  phoneNum: string | null;
  telNum: string | null;
  emailAd: string | null;
  barangayAddress: string | null;
}

export const barangayInfoService = {
  async getInfo(): Promise<BarangayInfoApi> {
    const response = await api.get("/barangay-info");
    return response.data.data;
  },

  async updateInfo(data: UpdateBarangayInfoPayload): Promise<void> {
    await api.put("/barangay-info", data);
  },
};
