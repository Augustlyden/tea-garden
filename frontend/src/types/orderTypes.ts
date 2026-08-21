export type OrderStatus = 'Beställd' | 'Behandlad' | 'Levererad' | 'Återbetald';

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