export interface CartInstance {
  cartId?: number,
  productId: number,
  quantity: number,
  cartToken: string
}

export interface CartDatabaseRow {
  id: number,
  product_id: number,
  quantity: number,
  cart_token: string
}