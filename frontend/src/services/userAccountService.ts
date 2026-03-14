import api from "./api";

export interface UserAccountApi {
  UserID: number;
  Username: string;
  Role: "Admin" | "Staff";
  AccStatus: "Active" | "Inactive";
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: "Admin" | "Staff";
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  role?: "Admin" | "Staff";
}

export const userAccountService = {
  async getAll(): Promise<UserAccountApi[]> {
    const response = await api.get("/users");
    return response.data.data;
  },

  async create(data: CreateUserPayload): Promise<{ userId: number }> {
    const response = await api.post("/users", data);
    return response.data.data;
  },

  async update(id: number, data: UpdateUserPayload): Promise<void> {
    await api.put(`/users/${id}`, data);
  },

  async updateStatus(id: number, status: "Active" | "Inactive"): Promise<void> {
    await api.patch(`/users/${id}/status`, { status });
  },
};
