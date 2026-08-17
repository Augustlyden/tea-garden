export interface StatusHistoryResponse {
  status: string;
  changedAt: Date;
  admin: string;
}

export interface AdminOrderResponse {
  orderId: number;
  totalAmount: number;
  orderDate: Date;
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
  currentStatus: string;
}