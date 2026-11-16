import api from "../config/api";
import type { AdminOrderDetail, AdminOrderResponse } from "../types/orderTypes";
import type { ApiResponse } from "../types/productTypes";

export const customerOrderService = {
  getOrders: async (): Promise<ApiResponse<AdminOrderResponse[]>> => {
    const response = await api.get<ApiResponse<AdminOrderResponse[]>>('/account/');
    return response.data;
  },

  getOrderById: async (id: number): Promise<ApiResponse<AdminOrderDetail>> => {
    const response = await api.get<ApiResponse<AdminOrderDetail>>(`/account/${id}`);
    return response.data;
  },
};