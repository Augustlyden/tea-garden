import api from "../config/api";
import type { RateResponse } from "../types/currencyTypes";
import type { ApiResponse } from "../types/productTypes";

export const currencyService = {
  getRates: async (): Promise<ApiResponse<RateResponse>> => {
    const response = await api.get<ApiResponse<RateResponse>>(`/currency/rates`);
    return response.data;
  }
};
