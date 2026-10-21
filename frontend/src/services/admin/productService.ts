import api from "../../config/api";
import { type ApiResponse, type AdminProductResponse, type CategoryResponse, type UserProductResponse, type ImportReport, type SearchParams, type SearchResponse } from "../../types/productTypes";

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
    const response = await api.patch<ApiResponse<AdminProductResponse>>(`/admin/products/${id}`, data);
    return response.data;
  },

  createProduct: async (data: FormData): Promise<ApiResponse<AdminProductResponse>> => {
    const response = await api.post<ApiResponse<AdminProductResponse>>('/admin/products/', data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<ApiResponse<AdminProductResponse>> => {
    const response = await api.delete<ApiResponse<AdminProductResponse>>(`admin/products/${id}`);
    return response.data;
  },

  getAllUserProducts: async (): Promise<ApiResponse<UserProductResponse[]>> => {
    const response = await api.get<ApiResponse<UserProductResponse[]>>('/user/products/');
    return response.data;
  },

  getUserProductById: async (id: number): Promise<ApiResponse<UserProductResponse>> => {
    const response = await api.get<ApiResponse<UserProductResponse>>(`/user/products/${id}`);
    return response.data;
  },

  importProducts: async (format: 'csv' | 'xml'): Promise<ApiResponse<ImportReport>> => {
    const response = await api.post<ApiResponse<ImportReport>>(`/admin/products/import/${format}`);
    return response.data;
  },

  searchProducts: async (searchParams: SearchParams): Promise<ApiResponse<SearchResponse>> => {
    const response = await api.get<ApiResponse<SearchResponse>>('/user/products/search', { 
      params: {q: searchParams.q, page: searchParams.page, pageSize: searchParams.pageSize}
    });
    return response.data;
  }
};