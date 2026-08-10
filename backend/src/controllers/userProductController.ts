import UserProduct from "../models/UserProduct";
import { Request, Response } from "express";

export const getAllProductsUser = async (req: Request, res: Response) => {
  try {
    const products = await UserProduct.findAllUser();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkter' });
  }
};

export const getProductByIdUser = async (
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }

    const product = await UserProduct.findByIdUser(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej.'});
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error while fetching product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkt' });
  }
};