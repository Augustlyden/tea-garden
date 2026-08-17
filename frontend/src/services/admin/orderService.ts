import api from "../../config/api";
import type { AdminOrderResponse, StatusHistoryResponse } from "../../types/orderTypes";
import type { ApiResponse } from "../../types/productTypes";

export const orderService = {
  getAllOrders: async (): Promise<ApiResponse<AdminOrderResponse[]>> => {
    const response = await api.get<ApiResponse<AdminOrderResponse[]>>('/orders/');
    return response.data;
  },

  getHistoryById: async (id: number): Promise<ApiResponse<StatusHistoryResponse[]>> => {
    const response = await api.get<ApiResponse<StatusHistoryResponse[]>>(`/orders/${id}/history`);
    return response.data;
  },
};