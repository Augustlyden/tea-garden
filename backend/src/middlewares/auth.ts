import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const readCustomer = (req: Request) => {
  const token = req.cookies.session;
  if (!token) return null;

  try {
    const payload = jwt.verify(req.cookies.session ?? '', process.env.SESSION_TOKEN_SECRET as string) as jwt.JwtPayload;
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch (error) {
    return null;
  }
};

export const verifyCustomer = (req: Request, res: Response, next: NextFunction) => {
  const customer = readCustomer(req);
  if (!customer) {
    res.status(401).json({ success: false, error: 'Du måste logga in' });
    return;
  }
  res.locals.customer = customer;
  next();
};

export const optionalCustomer = (req: Request, res: Response, next: NextFunction) => {
  const customer = readCustomer(req);
  if (customer) res.locals.customer = customer;
  next();
};