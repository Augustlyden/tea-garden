import { Link } from 'react-router-dom';
import styles from '../../css/product.module.css';
import type { OrderListProps } from '../../types/orderTypes';
import { OrderCard } from './OrderCard';

export const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div>
      <section className={styles.container}>
        {orders.map(order => (
          <article className={styles.card} key={order.orderId}>
            <Link to={`/admin/orders/${order.orderId}`}>
              <h2 className={styles.title}>Beställning</h2>
            </Link>
            <OrderCard order={order}/>
          </article>
        ))}
      </section>
    </div>
  );
};

