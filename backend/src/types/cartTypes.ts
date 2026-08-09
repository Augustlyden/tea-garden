export interface CartInstance {
  cartId?: number;
  productId: number;
  quantity: number;
  cartToken: string;
}

export interface CartWithProduct {
  cartId?: number;
  productId: number;
  quantity: number;
  cartToken: string;
  productName: string;
  price: number;
  imgUrl: string;
  isAvailable: boolean;
  isDeleted: boolean;
  subTotal: number;
}

export interface CartDatabaseRow {
  id: number;
  product_id: number;
  quantity: number;
  cart_token: string;
}

export interface CartWithProductDatabaseRow {
  id: number;
  product_id: number;
  quantity: number;
  cart_token: string;
  product_name: string;
  price: number | string;
  img_url: string;
  is_deleted: boolean;
  is_available: boolean;
  sub_total: number | string;
}