import api from "../config/api";
import type { CustomerResponse } from "../types/customerTypes";

export const customerService = {
  checkMe: async (): Promise<CustomerResponse> => {
    const response = await api.get<CustomerResponse>('/auth/me');
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};