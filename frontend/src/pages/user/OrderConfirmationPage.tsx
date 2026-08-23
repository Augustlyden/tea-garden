import { Link, useLocation } from "react-router-dom";
import styles from "../../css/confirmation.module.css";
import type { OrderInputResponse } from "../../types/orderTypes";
import { formatDate } from "../../utils/formater";
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state as OrderInputResponse | null;

  if (!order) {
    return (
      <main className={styles.container}>
        <p>Ingen orderinforamtion hittades</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.successHeader}>
        <CheckCircle2 size={48} className={styles.successIcon} />
        <h1 className={styles.title}>Tack för din beställning!</h1>
      </section>

      <div className={styles.orderCard}>
        <section className={styles.customerInfo}>
          <h2 className={styles.orderNumber}>Beställning #{order.orderId}</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Mottagare</span>
              <span className={styles.value}>{order.customerName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Leveransadress</span>
              <span className={styles.value}>
                {order.street} <br />
                {order.zipCode} {order.city}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Orderdatum</span>
              <span className={styles.value}>{formatDate(order.orderDate)}</span>
            </div>
          </div>
        </section>
        
        <section className={styles.productInfo}>
          <h2 className={styles.productsTitle}>Dina produkter</h2>
          <div className={styles.productsList}>
            {order.products.map(p => (
            <article key={p.productId} className={styles.itemContainer}>
              <Link className={styles.productLink} to={`/shop/products/${p.productId}`}>
                <div className={styles.imgContainer}>
                  {p.imgUrl ? (
                    <img className={styles.img} src={p.imgUrl} alt={p.productName} />
                  ) : (
                    <div className={styles.imgPlaceholder}>🍃</div>
                  )}
                </div>
                <div className={styles.infoContainer}>
                  <h3 className={styles.productName}>{p.productName}</h3>
                  <div className={styles.itemInfo}>
                    <p className={styles.quantity}>{p.quantity} st</p>
                    <p className={styles.price}>{p.price} kr/st</p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
          </div>

          <div className={styles.totalRow}>
            <span>Totalt betalat:</span>
            <strong className={styles.totalAmount}>{order.totalAmount} kr</strong>
          </div>
        </section>

      </div>

      <div className={styles.actionRow}>
        <Link to={'/shop/products'} className={styles.continue}>
          <ShoppingBag size={18} />
          Fortsätta handla
        </Link>
      </div>
    </main>
  );
};
