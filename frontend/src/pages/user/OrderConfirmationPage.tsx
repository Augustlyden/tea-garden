import { Link, useSearchParams } from "react-router-dom";
import styles from "../../css/confirmation.module.css";
import type { OrderInputResponse, PaymentStatus } from "../../types/orderTypes";
import { formatDate } from "../../utils/formater";
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from "react";
import { orderService } from "../../services/admin/orderService";
import { Spinner } from "../../components/shared/Spinner";

const statusContent: Record<PaymentStatus, { title: string, label: string, message?: string }> = {
  Betald: { title: 'Tack för din beställning', label: 'Totalt betalat' },
  Väntande: { title: 'Vi väntar på bekräftelse av din betalning', label: 'Totalt', message: 'Det kan ta en liten stund. Ladda om sidan om en stund.'},
  Avbruten: { title: 'Betalning genomfördes inte', label: 'Totalt' },
};

export const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderInputResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    if (!sessionId) {
      return;
    }
    const fetchOrder = async () => {
      try {
        const result = await orderService.getOrderBySessionId(sessionId);
        if (!ignore) {
          setOrder(result.data);
          setError('');
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Något gick fel');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    fetchOrder();
    return () => { ignore = true }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <main className={styles.container}>
        <div className={styles.statePage}>
          <p className={styles.stateText}>Ingen orderinformation hittades</p>
          <div className={styles.actionRow}>
            <Link to={'/shop/products'} className={styles.continue}>
              <ShoppingBag size={18} />
                Tillbaka till butiken
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.statePage}>
          <Spinner />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className={styles.container}>
        <div className={styles.statePage}>
          <p className={styles.stateText}>{error || 'Ingen orderinformation hittades'}</p>
            <div className={styles.actionRow}>
              <Link to={'/shop/products'} className={styles.continue}>
                <ShoppingBag size={18} />
                  Tillbaka till butiken
              </Link>
            </div>
        </div>
      </main>
    );
  }

  const { title, label, message } = statusContent[order.paymentStatus];

  return (
    <main className={styles.container}>
      <article>
        <section className={styles.successHeader} data-status={order.paymentStatus}>
          {order.paymentStatus === 'Betald' && 
            <CheckCircle2 size={48} className={styles.successIcon} />
          }
          <h1 className={styles.title}>{title}</h1>
          {message && <p className={styles.message}>{message}</p>}
        </section>

        <div className={styles.orderCard}>
          <section className={styles.customerInfo}>
            <h2 className={styles.orderNumber}>Beställning #{order.orderId}</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Mottagare</span>
                <span className={styles.value}>{order.customerName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Leveransadress</span>
                <span className={styles.value}>
                  {order.street} <br />
                  {order.zipCode} {order.city}
                </span>
              </div>
              {order.shippingMethod && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Leveranssätt</span>
                  <span className={styles.value}>
                    {order.shippingMethod === 'servicePoint' ? 'Ombud' : 'Hemleverans'}
                    {order.servicePointName && (
                      <>
                        <br />{order.servicePointName}
                        <br />{order.servicePointAddress}
                      </>
                    )}
                  </span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.label}>Orderdatum</span>
                <span className={styles.value}>{formatDate(order.orderDate)}</span>
              </div>
            </div>
          </section>
          
          <section className={styles.productInfo}>
            <h2 className={styles.productsTitle}>Dina produkter</h2>
            <div className={styles.productsList}>
              {order.products.map(p => (
              <article key={p.productId} className={styles.itemContainer}>
                <Link className={styles.productLink} to={`/shop/products/${p.productId}`}>
                  <div className={styles.imgContainer}>
                    {p.imgUrl ? (
                      <img className={styles.img} src={p.imgUrl} alt={p.productName} />
                    ) : (
                      <div className={styles.imgPlaceholder}>🍃</div>
                    )}
                  </div>
                  <div className={styles.infoContainer}>
                    <h3 className={styles.productName}>{p.productName}</h3>
                    <div className={styles.itemInfo}>
                      <p className={styles.quantity}>{p.quantity} st</p>
                      <p className={styles.price}>{p.price} kr/st</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
            </div>

            {order.shippingMethod && (
              <div className={styles.totalRow}>
                <span>Frakt:</span>
                <strong>{order.shippingPrice === 0 ? 'Fri frakt' : `${order.shippingPrice} kr`}</strong>
              </div>
            )}

            <div className={styles.totalRow}>
              <span>{label}:</span>
              <strong className={styles.totalAmount}>{order.totalAmount + order.shippingPrice} kr</strong>
            </div>
          </section>

        </div>

        <div className={styles.actionRow}>
          <Link to={'/shop/products'} className={styles.continue}>
            <ShoppingBag size={18} />
            Fortsätta handla
          </Link>
        </div>
      </article>
    </main>
  );
};
