import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/tokenTypes";
import { verifyToken } from "../utils/jwt";

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }

  req.admin = decoded;
  next();
}