import styles from '../../css/product.module.css';
import { ScrollText } from 'lucide-react';
import type { OrderCardProps } from '../../types/orderTypes';

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <>
      <div className={styles.imgContainer}>
        <ScrollText className={styles.img} color='#1C5D3B' strokeWidth={1}/>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>Beställning</h2>
          <h3 className={styles.category}>{order.currentStatus}</h3>
        </div>

        <div className={styles.productInfo}>
          <p className={styles.paragraph}> Namn: <span className={styles.span}>{order.customerName}</span></p>
          <p className={styles.paragraph}> Summa: <span className={styles.span}>{order.totalAmount} kr</span></p>
        </div>

      </div>
    </>
  );
};

