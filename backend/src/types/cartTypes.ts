import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface CartRequest <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, {}, ReqBody, any> {
  cartToken?: string;
}

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