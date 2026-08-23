import { Link, useLocation } from "react-router-dom";
import styles from "../../css/confirmation.module.css";
import type { OrderInputResponse } from "../../types/orderTypes";
import { formatDate } from "../../utils/formater";

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
      <h1 className={styles.title}>Tack för din beställning!</h1>
      <h2 className={styles.orderNumber}>#{order.orderId}</h2>
      <div className={styles.customerInfo}>
        <h3 className={styles.customerName}>{order.customerName}</h3>
        <p className={styles.orderInfo}>{order.street}</p>
        <p className={styles.orderInfo}>{order.zipCode}</p>
        <p className={styles.orderInfo}>{order.city}</p>
        <p className={styles.orderInfo}>{formatDate(order.orderDate)}</p>
      </div>

      <div className={styles.productInfo}>
        {order.products.map(p => (
          <article key={p.productId} className={styles.itemContainer}>
            <Link to={`/shop/products/${p.productId}`}>
              <div className={styles.imgContainer}>
                {p.imgUrl ? (
                  <img className={styles.img} src={`${import.meta.env.VITE_IMG_URL}${p.imgUrl}`} alt={p.productName} />
                ) : (
                  <div className={styles.imgPlaceholder}>🍃</div>
                )}
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.itemInfo}>
                  <h3 className={styles.productName}>{p.productName}</h3>
                  <p className={styles.price}>{p.price} kr</p>
                  <p className={styles.quantity}>{p.quantity} st</p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
};
