import styles from '../../css/orderList.module.css';
import type { OrderListProps } from '../../types/orderTypes';
import { OrderCard } from './OrderCard';

export const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div>
      <section className={styles.container}>
        {orders.map(order => (
          <article className={styles.card} key={order.orderId}>
            <OrderCard order={order}/>
          </article>
        ))}
      </section>
    </div>
  );
};

