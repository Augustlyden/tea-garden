export interface Rates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FrankfurterRates {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}