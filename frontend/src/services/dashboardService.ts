import api from './api';
import type { DashboardStats, Official } from '../types';

export const dashboardService = {
  /** Fetch all dashboard statistics (stat cards, classification, logs) */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    // Backend wraps in { success: true, data: ... }
    return response.data.data;
  },

  /** Fetch all barangay officials for the sidebar list */
  async getOfficials(): Promise<Official[]> {
    const response = await api.get('/officials');
    // Backend wraps in { success: true, data: [...] }
    return response.data.data;
  },
};
