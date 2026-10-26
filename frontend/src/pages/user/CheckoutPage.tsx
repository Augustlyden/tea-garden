import type { OrderInput } from "../../types/orderTypes";
import { orderService } from "../../services/admin/orderService";
import styles from "../../css/checkout.module.css";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { CartItem } from "../../components/user/CartItem";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const emptyCustomer: OrderInput = {
  customerName: '',
  street: '',
  zipCode: '',
  city: '',
};

export const CheckoutPage = () => {
  const [customer, setCustomer] = useState<OrderInput>(emptyCustomer);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { cart, totalPrice, totalItems, fetchCart } = useCart();

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

    setError('');

    setIsLoading(true);
    try {
      const response = await orderService.createOrder(customer);
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
            <p className={styles.totalLabel}>Totalt: <span className={styles.total}>{totalPrice} kr</span></p>
            <p className={styles.totalLabel}>Antal varor: <span className={styles.total}>{totalItems}</span></p>
          </div>
        </div>

      </main>
    
    </>
  );
};
