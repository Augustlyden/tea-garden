import api from "../../config/api";
import type { AdminOrderResponse, StatusHistoryResponse } from "../../types/orderTypes";
import type { ApiResponse } from "../../types/productTypes";

export const orderService = {
  getAllOrders: async (): Promise<ApiResponse<AdminOrderResponse[]>> => {
    const response = await api.get<ApiResponse<AdminOrderResponse[]>>('/admin/orders/');
    return response.data;
  },

  getHistoryById: async (id: number): Promise<ApiResponse<StatusHistoryResponse[]>> => {
    const response = await api.get<ApiResponse<StatusHistoryResponse[]>>(`admin/orders/${id}/history`);
    return response.data;
  },
};