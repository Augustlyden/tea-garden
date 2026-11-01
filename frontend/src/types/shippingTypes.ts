export type ShippingMethod = 'servicePoint' | 'homeDelivery';

export interface ServicePoint {
  id: string;
  name: string;
  address: string;
}

export interface DeliveryEstimates {
  homeDelivery: string | null;
  servicePoint: string | null;
}

export interface ShippingPrices {
  servicePoint: number;
  homeDelivery: number;
  freeShippingFrom: number;
}

export interface ShippingChoice {
  shippingMethod: ShippingMethod;
  servicePointId?: string;
}