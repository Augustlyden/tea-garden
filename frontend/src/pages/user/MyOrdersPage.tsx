import { Header } from "../../components/user/Header";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styles from '../../css/orderList.module.css';
import type { AdminOrderResponse } from "../../types/orderTypes";
import { customerOrderService } from "../../services/customerOrderService";
import { Spinner } from "../../components/shared/Spinner";
import { CustomerOrderCard } from "../../components/user/CustomerOrderCard";

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setError('');
        const data = await customerOrderService.getOrders();
        console.log(data);
        setOrders(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <Spinner />
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Header />
        <main>
          <div className={styles.container}>
            <h1 className={styles.heading}>Mina Beställningar</h1>
            <p className={styles.noOrders}>Du har inte handlat något än</p>
            <Link className={styles.shopLink} to={'/shop/products'}>Till Butiken</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <section className={styles.container}>
        <h1 className={styles.heading}>Mina Beställningar</h1>
          {orders.map(o => (
            <article key={o.orderId}>
              <CustomerOrderCard order={o} />
            </article>
          ))}
        </section>
        {error && <p className="error">{error} <br /> Prova att ladda om sidan.</p>}
      </main>
    </>
  );
};

export default MyOrdersPage