import api from "../../config/api";
import { type ApiResponse, type AdminProductResponse, type CategoryResponse, type AdminProductInput } from "../../types/productTypes";

export const productService = {
  getAllProducts: async (): Promise<ApiResponse<AdminProductResponse[]>> => {
    const response = await api.get<ApiResponse<AdminProductResponse[]>>('/admin/products/');
    return response.data;
  },

  getProductById: async (id: number): Promise<ApiResponse<AdminProductResponse>> => {
    const response = await api.get<ApiResponse<AdminProductResponse>>(`/admin/products/${id}`);
    return response.data;
  },

  getAllCategories: async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const response = await api.get<ApiResponse<CategoryResponse[]>>('/categories/');
    return response.data;
  },

  updateProduct: async (id: number, data: FormData): Promise<ApiResponse<AdminProductResponse>> => {
    const response = await api.patch<ApiResponse<AdminProductResponse>>('/admin/products/', {data, id});
    return response.data;
  },

  createProduct: async (data: FormData): Promise<ApiResponse<AdminProductResponse>> => {
    const response = await api.post<ApiResponse<AdminProductResponse>>('/admin/products/', data);
    return response.data;
  }
};