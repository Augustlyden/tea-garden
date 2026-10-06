import { FrankfurterRates, Rates } from "../types/currencyTypes";
import { Request, Response } from "express";

const BASE_URL = 'https://api.frankfurter.dev/v1';

export const getRates = async (base = 'SEK', symbols = ['SEK', 'EUR', 'USD']): Promise<Rates> => {
  const url = new URL(`${BASE_URL}/latest`);
  url.searchParams.set('base', base);
  url.searchParams.set('symbols', symbols.join(','));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Frankfurter responded with status ${response.status}`);
  }

  const data = await response.json() as FrankfurterRates;

  return { 
    base: data.base,
    date: data.date,
    rates: data.rates
  }
};

export const exchangeCurrency = async (req: Request, res: Response) => {
  try {
    const allowedCurrencies = ['SEK', 'EUR', 'USD'];
  
    const base = (req.query.base ?? 'SEK');
  
    if (typeof base !== 'string') {
      return res.status(400).json({ success: false, error: 'Wrong format of currency.' })
    }
  
    if (!allowedCurrencies.includes(base)) {
      return res.status(400).json({ success: false, error: 'Currency not available for exchange.' });
    }

    const rates = await getRates(base);
  
    res.json({ success: true, data: rates});
  } catch (error) {
    console.error('Error while fetching currencies', error);
    res.status(502).json({ success: false, error: 'Error while fetching currencies' });
  }
};