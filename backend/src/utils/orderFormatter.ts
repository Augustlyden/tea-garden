import { AdminOrderDetail, AdminOrderList, ItemDatabaseRow, OrderDatabaseRow, OrderInstance, OrderProductItem, OrderSummary, StatusDatabaseRow, StatusHistoryDatabaseRow, StatusHistoryItem } from "../types/orderTypes";

export const mapProductRows = (rows: ItemDatabaseRow[]): OrderProductItem[] => 
  rows.map(item => ({
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    price: Number(item.price),
    imgUrl: item.img_url
  }));

export const mapStatusRows = (rows: StatusHistoryDatabaseRow[]): StatusHistoryItem[] =>
  rows.map(item => ({
    status: item.status,
    changedAt: item.changed_at,
    admin: item.admin
  }));

export const orderSummary = (data: OrderDatabaseRow): OrderSummary => ({
  orderId: data.id,
  totalAmount: Number(data.total_amount),
  orderDate: data.order_date,
  customerName: data.customer_name,
  street: data.street,
  zipCode: data.zip_code,
  city: data.city
});

export const formatOrder = (
  orderData: OrderDatabaseRow, 
  productData: ItemDatabaseRow[]
): OrderInstance => ({
  ...orderSummary(orderData),
  products: mapProductRows(productData)
});

export const formatOrderDetail = (
  orderData: OrderDatabaseRow,
  productRows: ItemDatabaseRow[],
  statusRows: StatusHistoryDatabaseRow[]
): AdminOrderDetail => ({
  ...orderSummary(orderData),
  products: mapProductRows(productRows),
  history: mapStatusRows(statusRows)
});

export const formatOrderList = (
  orderData: OrderDatabaseRow,
  statusRows: StatusHistoryDatabaseRow[]
): AdminOrderList => ({
  ...orderSummary(orderData),
  history: mapStatusRows(statusRows)
});

