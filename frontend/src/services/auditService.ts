import api from "./api";
import type { AuditLog, AuditPagination } from "../types";

interface AuditLogResponse {
  data: AuditLog[];
  pagination: AuditPagination;
}

interface AuditSearchFilters {
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const auditService = {
  async getLogs(page = 1, limit = 50): Promise<AuditLogResponse> {
    const response = await api.get("/audit-logs", {
      params: { page, limit },
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async searchLogs(filters: AuditSearchFilters): Promise<AuditLog[]> {
    const response = await api.get("/audit-logs/search", {
      params: filters,
    });

    return response.data.data;
  },
};
