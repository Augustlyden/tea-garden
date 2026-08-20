import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AdminOrderDetail, OrderStatus } from "../../types/orderTypes";
import { orderService } from "../../services/admin/orderService";
import { Sidebar } from "../../components/admin/Sidebar";
import { ChevronLeft } from 'lucide-react';
import styles from '../../css/productDetail.module.css';
import { useAuth } from "../../context/AuthContext";
import { OrderDetails } from "../../components/admin/OrderDetails";
import { formatDate } from "../../utils/formater";

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<AdminOrderDetail>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError('');
        const data = await orderService.getOrderById(Number(id));
        setOrder(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  
  const handleUpdate = async (status: OrderStatus) => {
    try {
      const updated = await orderService.updateStatus(Number(id), status);
      setOrder(prev => prev ? {
        ...prev,
        currentStatus: updated.data.status,
        history: [
          {
            id: updated.data.id,
            status: updated.data.status,
            changedAt: formatDate(updated.data.changedAt),
            admin: admin?.username ?? 'Okänd'
          },
          ...prev.history
        ]
      } : prev);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  }
  
  if (isLoading) {
    return <div>Laddar...</div>
  }

  if (!order) {
    return <p>Beställningen kunde inte hittas.</p>;
  }

  return (
    <main>
      <Sidebar />
      <Link className={styles.back} to={'/admin/orders'}>
        <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
      </Link>

      <section>
        <OrderDetails order={order} onUpdate={handleUpdate}/>
        
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
};
