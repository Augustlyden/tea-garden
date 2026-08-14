import { Request, Response } from "express";
import Category from '../models/Catergory'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error while fetching categories:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta kategorier' });
  }
};