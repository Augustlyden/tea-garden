import Cart from "../models/cartModel";
import { Request, Response } from "express";
import { CartInstance } from "../types/cartTypes";
import Product from "../models/adminProductModel";

export const addToCart = async (
  req: Request<{ id: string }, {}, CartInstance>, res: Response
) => {
  try {
    const cartData = req.body;
    const productId = Number(cartData.productId)

    if (!req.cartToken) {
      return res.status(500).json({ success: false, error: 'Något gick fel' });
    }

    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }

    const product = await Product.findByIdAdmin(productId);

    if (!product || product.isAvailable === false) {
      return res.status(404).json({ success: false, error: 'Produkten finns inte i lager.'});
    }

    const existing = await Cart.findByProductAndToken(productId, req.cartToken);
    const currentQuantity = existing?.quantity ?? 0;

    if (currentQuantity + 1 > product.inStock) {
      return res.status(400).json({ success: false, error: 'Max antal nått.' });
    }

    const cart = await Cart.createOrUpdate({productId, quantity: 1, cartToken: req.cartToken});
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att lägga till produkt i varukorgen' });
  }
}

export const getCartByToken = async (req: Request, res: Response) => {
  try {
    if (!req.cartToken) {
      return res.status(500).json({ success: false, error: 'Något gick fel' });
    }
    const cart = await Cart.findByCartToken(req.cartToken);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error while fecthing cart:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta kundvagn' });
  }
}