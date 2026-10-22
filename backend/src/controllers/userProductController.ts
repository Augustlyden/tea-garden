import UserProduct from "../models/UserProduct";
import { Request, Response } from "express";
import { z } from 'zod';
import { searchProducts } from '../integrations/searchAdapter';

const SearchQuery = z.object({
  q: z.string().max(100).default(''),
  page: z.coerce.number().int().min(1).default(1), 
  pageSize: z.coerce.number().int().min(1).max(50).default(10), 
});

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

export const userSearch = async (req: Request, res: Response) => {
  try {
    const result = SearchQuery.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ success: false, error: `Invalid search parameters: ${z.prettifyError(result.error)}`, });
      return;
    }

    const params = {
      query: result.data.q,
      page: result.data.page,
      pageSize: result.data.pageSize
    };

    const searchResult = await searchProducts(params);
  
    res.json({ success: true, data: searchResult});
  } catch (error) {
    console.error('Error while searching for product:', error);
    res.status(502).json({ success: false, error: 'Misslyckades att söka efter produkt' });
  }
};