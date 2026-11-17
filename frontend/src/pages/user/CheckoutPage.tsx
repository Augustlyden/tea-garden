import type { OrderInput } from "../../types/orderTypes";
import { orderService } from "../../services/admin/orderService";
import styles from "../../css/checkout.module.css";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { CartItem } from "../../components/user/CartItem";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { DeliveryEstimates, ServicePoint, ShippingMethod, ShippingPrices } from "../../types/shippingTypes";
import { shippingService } from "../../services/shippingService";

const emptyCustomer: OrderInput = {
  customerName: '',
  street: '',
  zipCode: '',
  city: '',
  customerEmail: '',
};

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
  });

const formatPrice = (price: number) => (price === 0 ? 'Fri frakt' : `${price} kr`);

export const CheckoutPage = () => {
  const [customer, setCustomer] = useState<OrderInput>(emptyCustomer);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { cart, totalPrice, totalItems, fetchCart } = useCart();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('homeDelivery');
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [servicePointId, setServicePointId] = useState('');
  const [servicePointError, setServicePointError] = useState('');
  const [estimates, setEstimates] = useState<DeliveryEstimates | null>(null);
  const [prices, setPrices] = useState<ShippingPrices | null>(null);
  const zip = customer.zipCode.replace(/\s/g, '');
  const isZipComplete = /^\d{5}$/.test(zip);

  useEffect(() => {
    shippingService.getPrices()
      .then((response) => setPrices(response.data))
      .catch(() => setPrices(null));
  }, [totalPrice]);

  useEffect(() => {
    setServicePoints([]);
    setServicePointId('');
    setServicePointError('');
    setEstimates(null);
 
    if (!isZipComplete) return;
 
    let cancelled = false; 
 
    (async () => {
      const [pointsResult, estimatesResult] = await Promise.allSettled([
        shippingService.getServicePoints(zip),
        shippingService.getDeliveryEstimates(zip),
      ]);
      if (cancelled) return;
 
      if (pointsResult.status === 'fulfilled') {
        setServicePoints(pointsResult.value.data);
      } else {
        setServicePointError(
          pointsResult.reason instanceof Error ? pointsResult.reason.message : 'Kunde inte hämta ombud'
        );
      }
 
      if (estimatesResult.status === 'fulfilled') {
        setEstimates(estimatesResult.value.data);
      }
    })();
 
    return () => { cancelled = true; };
  }, [zip, isZipComplete]);
 
  const shippingPrice = prices ? prices[shippingMethod] : null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(customer).some(value => !value.trim())) {
      setError('Alla fält måste vara ifyllda');
      return;
    }

    if (!/^\d{3}\s?\d{2}$/.test(customer.zipCode)) {
      setError('Postnumret måste bestå av 5 siffror');
      return;
    }

    if (shippingMethod === 'servicePoint' && !servicePointId) {
      setError('Välj ett ombud');
      return;
    }

    setError('');

    setIsLoading(true);
    try {
      const response = await orderService.createOrder({
        ...customer,
        shippingMethod,
        servicePointId: shippingMethod === 'servicePoint' ? servicePointId : undefined,
      });
      window.location.href = response.data.url
    } catch (error) {
      fetchCart();
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Link className={styles.back} to={'/shop/products'}>
        <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
      </Link>
      <main className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Beställ</h1>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="customerName">
              <span className={styles.important}>*</span> Namn
            </label>
            <input 
              type="text"
              name="customerName"
              id="customerName"
              disabled={isLoading}
              className={styles.input} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="customerEmail">
              <span className={styles.important}>*</span> E-postadress
            </label>
            <input 
              type="email"
              name="customerEmail"
              id="customerEmail"
              disabled={isLoading}
              className={styles.input}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="street">
              <span className={styles.important}>*</span> Gatuadress
            </label>
            <input 
              type="text"
              name="street"
              id="street"
              disabled={isLoading}
              className={styles.input} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="zipCode">
              <span className={styles.important}>*</span> Postkod
            </label>
            <input 
              type="text"
              name="zipCode"
              id="zipCode"
              disabled={isLoading}
              className={styles.input} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="city">
              <span className={styles.important}>*</span> Postort
            </label>
            <input 
              type="text"
              name="city"
              id="city"
              disabled={isLoading}
              className={styles.input} 
              onChange={handleChange}
            />
          </div>

          <fieldset className={styles.shipping} disabled={isLoading}>
            <legend className={styles.label}>Leverans</legend>
 
            <label className={styles.option}>
              <input
                type="radio"
                name="shippingMethod"
                checked={shippingMethod === 'homeDelivery'}
                onChange={() => setShippingMethod('homeDelivery')}
              />
              <span>Hemleverans{prices && ` – ${formatPrice(prices.homeDelivery)}`}</span>
              {estimates?.homeDelivery && (
                <small>Beräknad leverans: {formatDate(estimates.homeDelivery)}</small>
              )}
            </label>
 
            <label className={styles.option}>
              <input
                type="radio"
                name="shippingMethod"
                checked={shippingMethod === 'servicePoint'}
                disabled={servicePoints.length === 0}
                onChange={() => setShippingMethod('servicePoint')}
              />
              <span>Ombud{prices && ` – ${formatPrice(prices.servicePoint)}`}</span>
              {estimates?.servicePoint && (
                <small>Beräknad leverans: {formatDate(estimates.servicePoint)}</small>
              )}
            </label>
 
            {shippingMethod === 'servicePoint' && (
              <div className={styles.servicePoints}>
                {servicePoints.map(point => (
                  <label key={point.id} className={styles.option}>
                    <input
                      type="radio"
                      name="servicePointId"
                      checked={servicePointId === point.id}
                      onChange={() => setServicePointId(point.id)}
                    />
                    <span>{point.name}</span>
                    <small>{point.address}</small>
                  </label>
                ))}
              </div>
            )}
 
            {!isZipComplete && <small>Fyll i postnummer för att se ombud och leveranstid.</small>}
            {servicePointError && <p className="error">{servicePointError}</p>}
          </fieldset>

          {error && <p className="error">{error}</p>}

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.button} 
              disabled={isLoading}
            >
              Köp
            </button>
          </div>
        </form>

        <div className={styles.products}>
          <section className={styles.itemList}>
            {cart.map(item => <CartItem key={item.cartId} item={item}/>)}
          </section>

          <div className={styles.totalWrapper}>
            <p className={styles.totalLabel}>Varor: <span className={styles.total}>{totalPrice} kr</span></p>
            <p className={styles.totalLabel}>
              Frakt: <span className={styles.total}>{shippingPrice === null ? '–' : formatPrice(shippingPrice)}</span>
            </p>
            <p className={styles.totalLabel}>
              Totalt: <span className={styles.total}>{totalPrice + (shippingPrice ?? 0)} kr</span>
            </p>
            <p className={styles.totalLabel}>Antal varor: <span className={styles.total}>{totalItems}</span></p>
          </div>
        </div>

      </main>
    
    </>
  );
};
