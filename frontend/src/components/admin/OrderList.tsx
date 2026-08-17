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
            <Link to={`/admin/products/${order.orderId}`}>
              <OrderCard order={order}/>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

