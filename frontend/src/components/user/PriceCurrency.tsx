import { useEffect, useState } from "react"
import type { RateProps } from "../../types/currencyTypes"
import { currencyService } from "../../services/currencyService";
import styles from '../../css/productDetail.module.css';
const allowedCurrencies = ['SEK', 'EUR', 'USD'];
const currencyLocales: Record<string, string> = {
  SEK: 'sv-SE',
  EUR: 'de-DE',
  USD: 'en-US',
};

export const PriceCurrency = ({ price }: RateProps) => {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('SEK');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await currencyService.getRates();
        setRates(data.data.rates);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      }
    };
    fetchRates();
  }, []);

  const exchangeCurrencies = (productPrice: number) => {
    const rate = currency === 'SEK' ? 1 : rates?.[currency];
    const effectiveCurrency = rate === undefined ? 'SEK' : currency;
    const effectiveRate = rate ?? 1;
    
    return new Intl.NumberFormat(currencyLocales[effectiveCurrency] ?? 'sv-SE', {
      style: 'currency',
      currency: effectiveCurrency,
    }).format(productPrice * effectiveRate);
  };

  return (
    <div className={styles.priceRow}>
      <span className={styles.price}>{exchangeCurrencies(price)}</span>
      <span className={styles.vatInfo}>inkl. moms</span>
      <select
        aria-label="Exchange Currency"
        disabled={!rates}
        value={currency}
        className={styles.select}
        onChange={(e) => setCurrency(e.target.value)}>
        {allowedCurrencies.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {error && <p className={styles.error}>{error} <br /> Prova att ladda om sidan.</p>}
    </div>
  );
};
