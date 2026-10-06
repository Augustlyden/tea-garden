export interface RateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface RateProps {
  price: number;
}