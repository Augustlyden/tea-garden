import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface CartRequest <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, {}, ReqBody, any> {
  cartToken?: string;
}

export interface AdminPayload {
  id: number;
  username: string;
}

export interface AuthRequest <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, {}, ReqBody, any> {
  admin?: AdminPayload;
}
