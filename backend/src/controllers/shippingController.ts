import { Request, Response } from "express";
import { fetchDeliveryEstimates, findServicePoints } from "../integrations/shippingAdapter";
import { NoServicePointsError } from '../utils/error';
import { CartRequest } from "../types/tokenTypes";
import Cart from "../models/Cart";
import { calculateAllShippingPrices } from "../utils/shippingPrices";

export const getServicePoints = async (req: Request, res: Response) => {
  const raw = typeof req.query.postalCode === 'string' ? req.query.postalCode : ''
  const postalCode = raw.replace(/\s/g, '')

  if (!/^\d{5}$/.test(postalCode)) {
    return res.status(400).json({ success: false, error: 'Postnumret är ogiltigt eller saknas' })
  }

  try {
    const servicePoints = await findServicePoints(postalCode)
    res.json({ success: true, data: servicePoints })
  } catch (error) {
    if (error instanceof NoServicePointsError) {
      return res.status(404).json({
        success: false,
        error: 'Vi hittade inga ombud för det postnumret. Kontrollera postnumret eller välj hemleverans.',
      })
    }
    
    console.error('Could not fetch PostNord service points:', error)
    res.status(502).json({
      success: false,
      error: 'Kunde inte hämta ombud just nu. Du kan välja hemleverans.',
    })
  }
}

export const getDeliveryEstimates = async (req: Request, res: Response) => {
  const raw = typeof req.query.postalCode === 'string' ? req.query.postalCode : ''
  const postalCode = raw.replace(/\s/g, '')

  if (!/^\d{5}$/.test(postalCode)) {
    return res.status(400).json({ success: false, error: 'Postnumret är ogiltigt eller saknas' })
  }

  try {
    const estimates = await fetchDeliveryEstimates(postalCode)
    res.json({ success: true, data: estimates })
  } catch (error) {
    console.error('Could not fetch PostNord delivery estimates:', error)
    res.status(502).json({
      success: false,
      error: 'Kunde inte hämta beräknad leverans just nu.',
    })
  }
}

export const getShippingPrices = async (req: CartRequest, res: Response) => {
  if (!req.cartToken) {
    return res.status(400).json({ success: false, error: 'Varukorgen kunde inte identifieras' });
  }

  try {
    const goodsTotal = await Cart.getGoodsTotal(req.cartToken);
    res.json({ success: true, data: calculateAllShippingPrices(goodsTotal) });
  } catch (error) {
    console.error('Could not calculate shipping prices:', error);
    res.status(500).json({ success: false, error: 'Kunde inte räkna ut fraktpriset' });
  }
};