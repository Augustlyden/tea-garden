import { Link, useParams } from "react-router-dom";
import { Header } from "../../components/user/Header";
import { useEffect, useState } from "react";
import type { AdminOrderDetail } from "../../types/orderTypes";
import { customerOrderService } from "../../services/customerOrderService";
import { Spinner } from "../../components/shared/Spinner";
import styles from '../../css/productDetail.module.css';
import { ChevronLeft } from "lucide-react";
import { CustomerOrderDetails } from "../../components/user/CustomerOrderDetails";

export const MyOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<AdminOrderDetail>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError('');
        const data = await customerOrderService.getOrderById(Number(id));
        setOrder(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Spinner />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main>
          <Link className={styles.back} to={'/shop/my-pages'}>
            <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
          </Link>
          <p className="error">{error || 'Beställningen kunde inte hittas.'}</p>
        </main>
      </>
    );
  }

  return ( 
    <>
      <Header />
      <main>
        <Link className={styles.back} to={'/shop/my-pages'}>
          <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
        </Link>

        <section>
          <CustomerOrderDetails order={order} />
        </section>
        
      </main>
    </>
  );
};