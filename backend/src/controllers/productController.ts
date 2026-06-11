import Product from "../models/productModel";
import { Request, Response } from "express";
import { ProductAttributes } from "../types/productTypes";

export const createProduct = async (
  req: Request<{}, {}, ProductAttributes>,
  res: Response
) => {
  try {
    const productData = req.body;

    if (productData.price < 0 || productData.inStock < 0) {
      return res.status(400).json({ success: false, error: 'Pris och/eller lager kan inte vara ett negativt tal.'});
    }

    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, data: newProduct });

  } catch (error) {
    console.error('Error while creating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att skapa produkt' });
  }
}