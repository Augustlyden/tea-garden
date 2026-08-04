import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const cartToken = (req: Request, res: Response, next: NextFunction) => {
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