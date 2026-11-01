import api from "../config/api";
import type { ApiResponse } from '../types/productTypes';
import type { ServicePoint, DeliveryEstimates, ShippingPrices } from '../types/shippingTypes';

export const shippingService = {
  getServicePoints: async (postalCode: string): Promise<ApiResponse<ServicePoint[]>> => {
    const response = await api.get<ApiResponse<ServicePoint[]>>('/shipping/service-points', {
      params: { postalCode },
    });
    return response.data;
  },

  getDeliveryEstimates: async (postalCode: string): Promise<ApiResponse<DeliveryEstimates>> => {
    const response = await api.get<ApiResponse<DeliveryEstimates>>('/shipping/delivery-estimates', {
      params: { postalCode },
    });
    return response.data;
  },

  getPrices: async (): Promise<ApiResponse<ShippingPrices>> => {
    const response = await api.get<ApiResponse<ShippingPrices>>('/shipping/prices');
    return response.data;
  },
};
