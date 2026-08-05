export interface OrderProductItem {
  productId: number;
  productName: string;
  imgUrl: string;
  quantity: number;
  price: number;
}

export interface OrderAttributes {
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
}

export interface OrderInstance {
  orderId: number;
  totalAmount: number;
  orderDate: Date;
  customerName: string;
  street: string;
  zipCode: string;
  city: string;
  products: OrderProductItem[];
}

export interface OrderDatabaseRow {
  id: number;
  total_amount: number | string;
  order_date: Date;
  customer_name: string;
  street: string;
  zip_code: string;
  city: string;
}

export interface ItemDatabaseRow {
  product_id: number,
  quantity: number,
  price: number | string, 
  product_name: string;
  img_url: string;
}