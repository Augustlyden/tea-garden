import jwt from 'jsonwebtoken';
import { AdminPayload, AuthRequest } from '../types/tokenTypes';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing");
}

export const generateToken = (adminId: number, username: string) => {
  return jwt.sign(
    { id: adminId, username },
    jwtSecret,
    { expiresIn: '24h'}
  );
}

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, jwtSecret) as AdminPayload;
  } catch (error) {
    return null;
  }
}