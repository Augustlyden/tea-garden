export type OrderStatus = 'Beställd' | 'Behandlad' | 'Levererad' | 'Återbetald';

export interface OrderProductItem {
  productId: number;
  productName: string;
  imgUrl: string;
  quantity: number;
  price: number;
}

export interface StatusHistoryItem {
  id: number;
  status: OrderStatus;
  changedAt: Date;
  admin: string | null;
}

export interface OrderInput {
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
}

export interface OrderSummary {
  orderId: number;
  totalAmount: number;
  orderDate: Date;
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
  currentStatus: OrderStatus;
}

export interface OrderInstance extends OrderSummary {
  products: OrderProductItem[];
}  

export interface AdminOrderDetail extends OrderSummary {
  products: OrderProductItem[];
  history: StatusHistoryItem[];
}

export interface StatusUpdateResult {
  id: number;
  orderId: number;
  status: OrderStatus;
  changedAt: Date;
  adminId: number | null;
}

export interface OrderDatabaseRow {
  id: number;
  total_amount: number | string;
  order_date: Date;
  customer_name: string;
  street: string;
  zip_code: string;
  city: string;
  current_status: OrderStatus;
}

export interface ItemDatabaseRow {
  product_id: number,
  quantity: number,
  price: number | string, 
  product_name: string;
  img_url: string;
}

export interface StatusDatabaseRow {
  id: number;
  order_id: number;
  status: OrderStatus;
  changed_at: Date;
  admin_id: number | null;
}

export interface StatusHistoryDatabaseRow extends StatusDatabaseRow {
  admin: string | null;
}