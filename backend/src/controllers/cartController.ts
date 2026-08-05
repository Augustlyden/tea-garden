import Cart from "../models/cartModel";
import { Request, Response } from "express";
import { CartInstance, CartRequest } from "../types/cartTypes";
import Product from "../models/adminProductModel";

export const addToCart = async (
  req: CartRequest<{}, {}, CartInstance>, res: Response
) => {
  try {
    const cartData = req.body;
    const productId = Number(cartData.productId)

    if (!req.cartToken) {
      return res.status(400).json({ success: false, error: 'Något gick fel' });
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

export const getCartByToken = async (req: CartRequest, res: Response) => {
  try {
    if (!req.cartToken) {
      return res.status(400).json({ success: false, error: 'Något gick fel' });
    }
    const cart = await Cart.findByCartToken(req.cartToken);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error while fecthing cart:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta kundvagn' });
  }
}

export const removeFromCart = async (req: CartRequest<{ id: string }>, res: Response) => {
  try {
    if (!req.cartToken) {
      return res.status(400).json({ success: false, error: 'Något gick fel' });
    }

    const cartId = Number(req.params.id);
    if (Number.isNaN(cartId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt kundvagn-ID' });
    }

    const deleted = await Cart.delete(cartId, req.cartToken);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Varan hittades ej' });
    }

    res.json({ success: true, message: 'Vara raderad', data: deleted });
  } catch (error) {
    console.error('Error while deleting cart', error);
    res.status(500).json({ success: false, error: 'Misslyckades att radera vara' });
  }
}

export const decreaseQuantity = async (req: CartRequest<{ id: string }>, res: Response) => {
  try {
    if (!req.cartToken) {
      return res.status(400).json({ success: false, error: 'Något gick fel' });
    }

    const cartId = Number(req.params.id);
    if (Number.isNaN(cartId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt kundvagn-ID' });
    }

    const decreased = await Cart.decrease(cartId, req.cartToken);
    if (decreased) {
      return res.json({ success: true, data: decreased });
    }

    const deleted = await Cart.delete(cartId, req.cartToken);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Varan hittades ej' });
    }

    res.json({ success: true, message: 'Vara raderad', data: deleted });
  } catch (error) {
    console.error('Error while decreasing quantity', error);
    res.status(500).json({ success: false, error: 'Misslyckades att minska antal' });
  }
}