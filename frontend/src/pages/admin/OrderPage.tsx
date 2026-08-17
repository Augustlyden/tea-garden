import { Sidebar } from "../../components/admin/Sidebar";
import { orderService } from "../../services/admin/orderService";
import type { AdminOrderResponse } from "../../types/orderTypes";
import { useEffect, useState } from "react";
import styles from '../../css/product.module.css';
import { OrderList } from "../../components/admin/OrderList";

export const OrderPage = () => {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Beställd' | 'Behandlad' | 'Levererad' | 'Återbetald'>('all');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data.data);
        setError('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter(o => filter === 'all' || filter === o.currentStatus);

  if (isLoading) {
    return <div>Laddar...</div>
  }

  return (
    <main>
      <Sidebar />
      <div className={styles.filterWrapper}>
        <div className={styles.inputGroup}>
          <input 
            type="radio"
            className={styles.radio}
            id="filter-all"
            name="status"
            defaultChecked
            onChange={() => setFilter('all')} 
          />
          <label htmlFor="filter-all" className={styles.label}>Alla</label>

          <input 
            type="radio"
            className={styles.radio}
            id="filter-ordered"
            name="status"
            onChange={() => setFilter('Beställd')}
          /> 
          <label htmlFor="filter-ordered" className={styles.label}>Beställd</label>

          <input 
            type="radio"
            className={styles.radio}
            id="filter-proccessed"
            name="status"
            onChange={() => setFilter('Behandlad')}
          /> 
          <label htmlFor="filter-proccessed" className={styles.label}>Behandlad</label>

          <input 
            type="radio"
            className={styles.radio}
            id="filter-delivered"
            name="status"
            onChange={() => setFilter('Levererad')}
          /> 
          <label htmlFor="filter-delivered" className={styles.label}>Levererad</label>

          <input 
            type="radio"
            className={styles.radio}
            id="filter-refunded"
            name="status"
            onChange={() => setFilter('Återbetald')}
          /> 
          <label htmlFor="filter-refunded" className={styles.label}>Återbetald</label>
        </div>
      </div>
      <OrderList orders={filteredOrders}/>
      {error && <p className="error">{error}</p>}
    </main>
  );
};
