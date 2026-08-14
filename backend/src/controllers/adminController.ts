import { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../types/tokenTypes";

const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const loginAdmin = async (
  req: Request<{ username: string, password: string }>, res: Response
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Användarnamn och lösenord krävs' });
    }

    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Ogiltiga inloggningsuppgifter' });
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Ogiltiga inloggningsuppgifter' });
    }

    const token = generateToken(admin.id, admin.username);

    const COOKIE_MAX_AGE = process.env.NODE_ENV === 'production'
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE
    }); 

    res.json({ success: true, data: { id: admin.id, username: admin.username }});
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, error: 'Inloggning misslyckades'});
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ success: true, message: 'Utloggad' });
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ success: false, error: 'Utloggning misslyckades' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { id: req.admin!.id, username: req.admin!.username} });
};