import type { ShippingMethod } from "./shippingTypes";

export type OrderStatus = 'Beställd' | 'Behandlas' | 'Levererad' | 'Återbetald';
export type PaymentStatus = 'Väntande' | 'Betald' | 'Avbruten';

export interface StatusHistoryResponse {
  id: number;
  status: OrderStatus;
  changedAt: string;
  admin?: string;
}

export interface AdminOrderResponse {
  orderId: number;
  totalAmount: number;
  orderDate: string;
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
  currentStatus: OrderStatus;
  shippingMethod: ShippingMethod | null;
  shippingPrice: number;
  servicePointId: string | null;
  servicePointName: string | null;
  servicePointAddress: string | null;
}

export interface OrderProductItem {
  productId: number;
  productName: string;
  imgUrl: string;
  quantity: number;
  price: number;
}

export interface OrderInput {
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
}

export interface AdminOrderDetail extends AdminOrderResponse {
  products: OrderProductItem[];
  history: StatusHistoryResponse[];
}

export interface OrderInputResponse extends AdminOrderResponse {
  products: OrderProductItem[];
  paymentStatus: PaymentStatus;
}

export interface OrderListProps {
  orders: AdminOrderResponse[];
}

export interface OrderCardProps {
  order: AdminOrderResponse;
}

export interface OrderDetailProps {
  order: AdminOrderDetail;
  onUpdate: (status: OrderStatus) => void;
}

export interface CustomerDetailProps {
  order: AdminOrderDetail;
}

export interface CheckputSessionResponse {
  url: string;
}