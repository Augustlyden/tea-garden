import api from "../config/api";
import type { CartResponse, CartWithProductResponse } from "../types/cartTypes";
import type { ApiResponse } from "../types/productTypes";

export const cartService = {
  addToCart: async (productId: number): Promise<ApiResponse<CartResponse>> => {
    const response = await api.post<ApiResponse<CartResponse>>('/cart/', {productId});
    return response.data;
  },

  getCart: async (): Promise<ApiResponse<CartWithProductResponse[]>> => {
    const response = await api.get<ApiResponse<CartWithProductResponse[]>>('/cart/');
    return response.data;
  },

  removeFromCart: async (id: number): Promise<ApiResponse<CartResponse>> => {
    const response = await api.delete<ApiResponse<CartResponse>>(`/cart/${id}`);
    return response.data;
  },

  decreaseQuantity: async (id: number): Promise<ApiResponse<CartResponse>> => {
    const response = await api.patch<ApiResponse<CartResponse>>(`/cart/${id}`);
    return response.data;
  }
};