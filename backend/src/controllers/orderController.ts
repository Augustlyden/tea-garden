import { Request, Response } from "express";
import { OrderInput} from "../types/orderTypes";
import { CartRequest } from "../types/cartTypes";
import Order from "../models/orderModel";
import { NotFoundError, InsufficientStockError } from "../utils/error";

export const placeOrder = async (
  req: CartRequest<{}, {}, OrderInput>, res: Response
) => {
  try {
    const orderData = req.body;
    
    if (!req.cartToken) {
      return res.status(400).json({ success: false, error: 'Varukorgen kunde inte identifieras' });
    }

    if (!orderData.customerName) {
      return res.status(400).json({ success: false, error: 'Namn saknas' });
    }   
    
    if (!orderData.street) {
      return res.status(400).json({ success: false, error: 'Gatuadress saknas' });
    } 

    if (!orderData.zipCode || (!/^\d{5}$/.test(orderData.zipCode))) {
      return res.status(400).json({ success: false, error: 'Postnumret är ogiltigt eller saknas' });
    } 

    if (!orderData.city) {
      return res.status(400).json({ success: false, error: 'Postort saknas' });
    } 

    const order = await Order.create(req.cartToken, orderData);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, error: 'Varukorgen kunde inte hittas' });
    }

    if (error instanceof InsufficientStockError) {
      return res.status(409).json({ success: false, error: 'Otillräckligt lager' });
    }

    console.error('Error while creating order:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att lägga en beställning' });
  }
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error while fetching orders:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta beställningar' });
  }
}

export const getOrderById = async (
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const orderId = Number(req.params.id);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt order-ID' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Beställningen hittades ej' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error while fetching order:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta beställning' });
  }
}
