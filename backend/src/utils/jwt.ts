import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { AdminPayload} from '../types/tokenTypes';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing");
}

export const generateToken = (adminId: number, username: string) => {
  return jwt.sign(
    { id: adminId, username },
    jwtSecret,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'] }
  );
}

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, jwtSecret) as AdminPayload;
  } catch (error) {
    return null;
  }
}