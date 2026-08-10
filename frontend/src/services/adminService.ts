import api from "../config/api";
import type { AdminLoginResponse } from "../types/adminTypes";

const adminService = {
  login: async (username: string, password: string): Promise<AdminLoginResponse> => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },

  logout: async () => {
    const  response = await api.post('/admin/logout');
    return response.data;
  },

  checkMe: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  }
}

export default adminService;