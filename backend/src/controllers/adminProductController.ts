import Product from "../models/AdminProduct";
import { Request, Response } from "express";
import { ProductAttributes } from "../types/productTypes";
import { parseProductAttributes, validateProductNumbers } from "../utils/productValidator";

export const createProduct = async (
  req: Request<{}, {}, ProductAttributes>, res: Response
) => {
  try {
    const productData = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ success: false, error: 'Produktbild krävs.' })
    }

    const numValidation = validateProductNumbers(productData);
    if (!numValidation.valid) {
      return res.status(400).json({ success: false, error: numValidation.error });
    }

    const attrValidation = parseProductAttributes(productData);
    if (!attrValidation.valid) {
      return res.status(400).json({ success: false, error: attrValidation.error });
    }

    productData.imgUrl = `/uploads/${file.filename}`;

    const newProduct = await Product.create(productData);
    res.status(201).json({ success: true, data: newProduct });

  } catch (error) {
    console.error('Error while creating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att skapa produkt' });
  }
}

export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAllAdmin();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkter' });
  }
}

export const getProductByIdAdmin = async (
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    } 

    const product = await Product.findByIdAdmin(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error while fetching product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkt' });
  }
}

export const updateProduct = async (
  req: Request<{ id: string }, {}, Partial<ProductAttributes>>,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }

    const productData = req.body;
    const file = req.file as Express.Multer.File;

    if (file) {
      productData.imgUrl = `/uploads/${file.filename}`;
    } 

    const numValidation = validateProductNumbers(productData, true);
    if (!numValidation.valid) {
      return res.status(400).json({ success: false, error: numValidation.error });
    }

    const attrValidation = parseProductAttributes(productData);
    if (!attrValidation.valid) {
      return res.status(400).json({ success: false, error: attrValidation.error });
    }

    const product = await Product.update(productId, productData);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error while updating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att uppdatera produkt'})
  }
}

export const deleteProduct = async ( 
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }
    const deletedProduct = await Product.delete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej' });
    }

    res.json({ success: true, message: 'Produkten raderad', data: deletedProduct });
  } catch (error) {
    console.error('Error while deleting product', error);
    res.status(500).json({ success: false, error: 'Misslyckades att radera produkt' });
  }
}