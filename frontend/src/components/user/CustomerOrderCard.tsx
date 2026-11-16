import styles from '../../css/orderList.module.css';
import { ScrollText } from 'lucide-react';
import { type OrderCardProps } from '../../types/orderTypes';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formater';

export const CustomerOrderCard = ({ order }: OrderCardProps) => {
  return (
    <>
      <div className={styles.orderCardMain}>
        <Link to={`/shop/my-pages/${order.orderId}`} className={styles.cardLink}>
          <div className={styles.imgContainer}>
            <ScrollText className={styles.img} color='#1C5D3B' strokeWidth={1.5} size={28}/>
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.headerInfo}>
              <h2 className={styles.title}>Beställning #{order.orderId}</h2>
              <span className={`${styles.statusBadge} ${styles[order.currentStatus.toLowerCase()]}`}>
                {order.currentStatus}
              </span>
            </div>

            <div className={styles.productInfo}>
              <p className={styles.paragraph}> Datum: <span className={styles.span}>{formatDate(order.orderDate)}</span></p>
              <p className={styles.paragraph}> Summa: <span className={styles.totalSpan}>{order.totalAmount + order.shippingPrice} kr</span></p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};