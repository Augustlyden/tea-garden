export interface StatusHistoryResponse {
  id: number;
  status: string;
  changedAt: string;
  admin: string;
}

export interface AdminOrderResponse {
  orderId: number;
  totalAmount: number;
  orderDate: string;
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
  currentStatus: 'Beställd' | 'Behandlad' | 'Levererad' | 'Återbetald';
}

export interface OrderListProps {
  orders: AdminOrderResponse[];
}

export interface OrderCardProps {
  order: AdminOrderResponse;
}