import api from "../../config/api";

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/admin/products/');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },
};