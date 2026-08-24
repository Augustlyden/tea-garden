import styles from '../../css/orderDetail.module.css';
import type { OrderDetailProps, OrderStatus } from '../../types/orderTypes';
import { formatDate } from '../../utils/formater';

export const OrderDetails = ({ order, onUpdate }: OrderDetailProps) => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <section className={styles.infoColumn}>
          <div className={styles.mainHeaderInfo}>

            <div className={styles.metaRow}>
              <span className={styles.orderIdBadge}>Beställning #{order.orderId}</span>
              <div className={styles.dateAndPrice}>
                <p className={styles.metaText}>Datum <span className={styles.metaValue}>{formatDate(order.orderDate)}</span></p>
                <p className={styles.metaText}>Totalt <span className={styles.totalValue}>{order.totalAmount} kr</span></p>
              </div>
            </div>

            <div className={styles.customerGrid}>
              <div>
                <h1 className={styles.customerName}>{order.customerName}</h1>
                <p className={styles.adress}>{order.street}, {order.zipCode} {order.city}</p>
              </div>
              <div className={styles.selectContainer}>
                <label className={styles.selectLabel}>
                  Ändra status
                </label>
                <select
                  className={styles.select}   
                  value={order.currentStatus} 
                  onChange={(e) => onUpdate(e.target.value as OrderStatus)}
                >
                  <option value="Beställd">Beställd</option>
                  <option value="Behandlas">Behandlas</option>
                  <option value="Levererad">Levererad</option>
                  <option value="Återbetald">Återbetald</option>
                </select>
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
          </article>

          <article className={styles.historyContainer}>
            <h2 className={styles.sectionTitle}>Statushistorik</h2>
            <ul className={styles.timeline}>
              {order.history.map(h => (
                <li className={styles.timelineItem} key={h.id}>
                  <div className={styles.timelineContent}>
                    <div className={styles.statusRow}>
                      <span className={styles.statusName}>{h.status}</span>
                      <span className={styles.adminBadge}>{h.admin ? h.admin : 'system'}</span>
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
