import api from "../../config/api";
import type { AdminLoginResponse, Issue, IssueInput, IssueListItem } from "../../types/adminTypes";
import type { ApiResponse } from "../../types/productTypes";

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
  },

  getIssues: async (): Promise<ApiResponse<IssueListItem[]>> => {
    const response = await api.get<ApiResponse<IssueListItem[]>>('/admin/issues');
    return response.data;
  },

  createIssue: async (body: IssueInput): Promise<ApiResponse<Issue>> => {
    const response = await api.post<ApiResponse<Issue>>('/admin/issues', body);
    return response.data;
  }
};