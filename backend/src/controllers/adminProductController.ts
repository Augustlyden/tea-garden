import Product from "../models/productModel";
import { Request, Response } from "express";
import { ProductAttributes } from "../types/productTypes";

export const createProduct = async (
  req: Request<{}, {}, ProductAttributes>,
  res: Response
) => {
  try {
    const productData = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ success: false, error: 'Produktbild krävs.' })
    }

      productData.price = Number(productData.price);
      productData.inStock = Number(productData.inStock);
      productData.categoryId = Number(productData.categoryId);

    if (productData.price < 0 || productData.inStock < 0) {
      return res.status(400).json({ success: false, error: 'Pris och/eller lager kan inte vara ett negativt tal.'});
    }

    productData.imgUrl = `/uploads/${file.filename}`;

    if (productData.attributes && typeof productData.attributes === 'string') {
      productData.attributes = JSON.parse(productData.attributes as any)
    }

    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, data: newProduct });

  } catch (error) {
    console.error('Error while creating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att skapa produkt' });
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAllAdmin();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkter' });
  }
}