import api from "../../config/api";
import type { AdminOrderDetail, AdminOrderResponse, CheckputSessionResponse, OrderInput, OrderInputResponse, StatusHistoryResponse } from "../../types/orderTypes";
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

  getOrderById: async (id: number): Promise<ApiResponse<AdminOrderDetail>> => {
    const response = await api.get<ApiResponse<AdminOrderDetail>>(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<StatusHistoryResponse>> => {
    const response = await api.patch<ApiResponse<StatusHistoryResponse>>(`/orders/${id}`, {status});
    return response.data;
  },

  createOrder: async (data: OrderInput): Promise<ApiResponse<CheckputSessionResponse>> => {
    const response = await api.post<ApiResponse<CheckputSessionResponse>>('/orders/', data);
    return response.data;
  },

  getOrderBySessionId: async (sessionId: string): Promise<ApiResponse<OrderInputResponse>> => {
    const response = await api.get<ApiResponse<OrderInputResponse>>(
      `/orders/session/${encodeURIComponent(sessionId)}`
    );
    return response.data;
  }
};