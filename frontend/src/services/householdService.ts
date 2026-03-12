import api from "./api";
import type {
  HouseholdListItem,
  HouseholdDetail,
  HouseholdNumber,
} from "../types";

export const householdService = {
  /** List all households */
  async getAll(): Promise<HouseholdListItem[]> {
    const response = await api.get("/households");
    return response.data.data;
  },

  /** Get a single household with its residents */
  async getById(id: number): Promise<HouseholdDetail> {
    const response = await api.get(`/households/${id}`);
    return response.data.data;
  },

  /** Create a new household (Admin only) */
  async create(data: { addressId: number }): Promise<{ householdId: number }> {
    const response = await api.post("/households", data);
    return response.data.data;
  },

  /** Update a household (Admin only) */
  async update(id: number, data: { addressId?: number }): Promise<void> {
    await api.put(`/households/${id}`, data);
  },

  /** Update household number status */
  async updateStatus(
    houseId: number,
    status: "Available" | "Assigned" | "Inactive",
  ): Promise<void> {
    await api.put(`/households/${houseId}/status`, { status });
  },

  /** Get all household numbers (house plates) */
  async getAllNumbers(): Promise<HouseholdNumber[]> {
    const response = await api.get("/household-numbers");
    return response.data.data;
  },

  /** Create a new household number (Admin only) */
  async createNumber(data: {
    householdNumberName: string;
    addressId?: number;
  }): Promise<{ houseId: number }> {
    const response = await api.post("/household-numbers", data);
    return response.data.data;
  },
};
