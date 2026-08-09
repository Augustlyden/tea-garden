import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import { CartRequest } from '../types/tokenTypes';

export const cartToken = (req: CartRequest, res: Response, next: NextFunction) => {
  let cartToken = req.cookies.cart_token;

  if (!cartToken) {
    cartToken = crypto.randomUUID();

    res.cookie('cart_token', cartToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
  }

  req.cartToken = cartToken;

  next();
}