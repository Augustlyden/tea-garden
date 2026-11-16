import styles from '../../css/orderDetail.module.css';
import type { CustomerDetailProps } from '../../types/orderTypes';
import { formatDate } from '../../utils/formater';

export const CustomerOrderDetails = ({ order }: CustomerDetailProps) => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <section className={styles.infoColumn}>
          <div className={styles.mainHeaderInfo}>

            <div className={styles.metaRow}>
              <span className={styles.orderIdBadge}>Beställning #{order.orderId}</span>
              <div className={styles.dateAndPrice}>
                <p className={styles.metaText}>Datum <span className={styles.metaValue}>{formatDate(order.orderDate)}</span></p>
                <p className={styles.metaText}>Totalt <span className={styles.totalValue}>{order.totalAmount + order.shippingPrice} kr</span></p>
              </div>
            </div>

            <div className={styles.customerGrid}>
              <div>
                <h1 className={styles.customerName}>{order.customerName}</h1>
                <p className={styles.address}>{order.street}, {order.zipCode} {order.city}</p>
              </div>
            </div>

          </div>
        </section>

        <section className={styles.columnsContainer}>

          <article className={styles.productContainer}>
            <h2 className={styles.sectionTitle}>Produkter</h2>
            <div className={styles.productList}>
              {order.products.map(p => (
                <p 
                  key={p.productId}   
                  className={styles.productName}
                >
                  <span className={styles.quantity}>{p.quantity} st</span> {p.productName}
                  <span className={styles.price}>{p.price} kr/st</span>
                </p>
              ))}
            </div>
            {order.shippingMethod && (
              <div className={styles.shippingInfo}>
                <h2 className={styles.sectionTitle}>Frakt</h2>
                <p className={styles.shippingRow}>
                  <span className={styles.shippingLabel}>Leveranssätt</span>
                  <span>{order.shippingMethod === 'servicePoint' ? 'Ombud' : 'Hemleverans'}</span>
                </p>
                {order.servicePointName && (
                  <p className={styles.shippingRow}>
                    <span className={styles.shippingLabel}>Ombud</span>
                    <span>{order.servicePointName}<br />{order.servicePointAddress}</span>
                  </p>
                )}
                <p className={styles.shippingRow}>
                  <span className={styles.shippingLabel}>Fraktpris</span>
                  <span>{order.shippingPrice === 0 ? 'Fri frakt' : `${order.shippingPrice} kr`}</span>
                </p>
              </div>
            )}
          </article>

          <article className={styles.historyContainer}>
            <h2 className={styles.sectionTitle}>Statushistorik</h2>
            <ul className={styles.timeline}>
              {order.history.map(h => (
                <li className={styles.timelineItem} key={h.id}>
                  <div className={styles.timelineContent}>
                    <div className={styles.statusRow}>
                      <span className={styles.statusName}>{h.status}</span>
                    </div>
                    <span className={styles.changedAt}>{formatDate(h.changedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

        </section>
      </div>
    </>
  );
};
