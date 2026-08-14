import api from "../../config/api";
import type { AdminLoginResponse } from "../../types/adminTypes";

export const adminService = {
  login: async (username: string, password: string): Promise<AdminLoginResponse> => {
    const response = await api.post<AdminLoginResponse>('/admin/login', { username, password });
    return response.data;
  },

  logout: async () => {
    await api.post('/admin/logout');
  },

  checkMe: async (): Promise<AdminLoginResponse> => {
    const response = await api.get<AdminLoginResponse>('/admin/me');
    return response.data;
  }
};