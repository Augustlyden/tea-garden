import { 
  AdminOrderDetail,
  CustomerOrderDetail,
  ItemDatabaseRow, 
  OrderDatabaseRow, 
  OrderInstance, 
  OrderProductItem, 
  OrderSummary, 
  StatusDatabaseRow, 
  StatusHistoryDatabaseRow, 
  StatusHistoryItem, 
  StatusUpdateResult 
} from "../types/orderTypes";

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
    id: item.id,
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
  city: data.city,
  currentStatus: data.current_status,
  paymentStatus: data.payment_status,
  shippingMethod: data.shipping_method,
  shippingPrice: Number(data.shipping_price),
  servicePointId: data.service_point_id,
  servicePointName: data.service_point_name,
  servicePointAddress: data.service_point_address,
  customerEmail: data.customer_email,
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

export const formatCustomerOrder = (
  orderData: OrderDatabaseRow,
  productRows: ItemDatabaseRow[],
  statusRows: StatusHistoryDatabaseRow[]
): CustomerOrderDetail => ({
  ...orderSummary(orderData),
  products: mapProductRows(productRows),
  history: statusRows.map(item => ({
    id: item.id,
    status: item.status,
    changedAt: item.changed_at
  }))
});

export const formatStatusUpdate = (
  data: StatusDatabaseRow
): StatusUpdateResult => ({
  id: data.id,
  orderId: data.order_id,
  status: data.status,
  changedAt: data.changed_at,
  adminId: data.admin_id
});

