import api from "./api";
import type {
  ReportDemographicsSummary,
  ReportDemographicsCategoryResponse,
  ReportFormARecord,
  ReportFormCData,
} from "../types";

interface CategoryQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export const reportService = {
  async getDemographicsSummary(): Promise<ReportDemographicsSummary> {
    const response = await api.get("/reports/demographics");
    return response.data.data;
  },

  async getDemographicsByCategory(
    category: string,
    query: CategoryQuery,
  ): Promise<ReportDemographicsCategoryResponse> {
    const response = await api.get(`/reports/demographics/${category}`, {
      params: query,
    });
    return response.data.data;
  },

  async getFormAData(householdId?: number): Promise<ReportFormARecord[]> {
    const response = await api.get("/reports/rbi/form-a", {
      params: householdId ? { householdId } : undefined,
    });
    return response.data.data;
  },

  async getFormCData(): Promise<ReportFormCData> {
    const response = await api.get("/reports/rbi/form-c");
    return response.data.data;
  },

  async downloadResidentPdf(residentId: number): Promise<Blob> {
    const response = await api.get(`/reports/residents/${residentId}/pdf`, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
