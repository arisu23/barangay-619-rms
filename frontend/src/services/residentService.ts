import api from './api';
import type { ResidentListItem, Resident, CreateResidentData } from '../types';

export interface ResidentSearchFilters {
  name?: string;
  sex?: string;
  civilStatus?: string;
  status?: string;
  householdId?: string;
  inhabitantType?: string;
  address?: string;
}

export const residentService = {
  /** Fetch all active residents (slim list for the table) */
  async getAll(): Promise<ResidentListItem[]> {
    const response = await api.get('/residents');
    return response.data.data;
  },

  /** Search residents with filters — sends query params to backend */
  async search(filters: ResidentSearchFilters): Promise<ResidentListItem[]> {
    const response = await api.get('/residents/search', { params: filters });
    return response.data.data;
  },

  /** Get one resident's full profile by ID */
  async getById(id: number): Promise<Resident> {
    const response = await api.get(`/residents/${id}`);
    return response.data.data;
  },

  /** Create a new resident (returns the new residentId) */
  async create(data: CreateResidentData): Promise<{ residentId: number }> {
    const response = await api.post('/residents', data);
    return response.data.data;
  },

  /** Update a resident's information */
  async update(id: number, data: Partial<Resident>): Promise<void> {
    await api.put(`/residents/${id}`, data);
  },
};
