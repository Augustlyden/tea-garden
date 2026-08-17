import styles from '../../css/product.module.css';
import { ScrollText } from 'lucide-react';
import { type StatusHistoryResponse, type OrderCardProps } from '../../types/orderTypes';
import { useState } from 'react';
import { orderService } from '../../services/admin/orderService';

export const OrderCard = ({ order }: OrderCardProps) => {
  const [history, setHistory] = useState<StatusHistoryResponse[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setIsExpanded(!isExpanded);
      setError('');
      if (history) return;
      setIsLoading(true);
      const data = await orderService.getHistoryById(order.orderId);
      setHistory(data.data);
      console.log(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('sv-Se');
  };

  const renderHistoryContent = () => {
    if (isLoading) {
      return <div>Laddar...</div>
    } else if (error) {
      return <p className="error">{error}</p>
    } else {
      return (
        history?.map(h => (
            <article key={h.id} className={styles.historyRow}>
              <h2 className={styles.status}>{h.status}</h2>
              <p>{formatDate(h.changedAt)}</p>
              {h.admin && <p className={styles.admin}>{h.admin}</p>}
            </article>
        ))
      )
    }
  }

  return (
    <>
      <div className={styles.imgContainer}>
        <ScrollText className={styles.img} color='#1C5D3B' strokeWidth={1}/>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.headerInfo}>
          <h3 className={styles.category}>{order.currentStatus}</h3>
        </div>

        <div className={styles.productInfo}>
          <p className={styles.paragraph}> Namn: <span className={styles.span}>{order.customerName}</span></p>
          <p className={styles.paragraph}> Summa: <span className={styles.span}>{order.totalAmount} kr</span></p>
        </div>
      </div>
      <button onClick={fetchHistory} className={styles.historyButton}>{isExpanded ? 'Dölj historik' : 'Visa historik'}</button>

      {isExpanded && 
        <div className={styles.historyContainer}>
          {renderHistoryContent()}
        </div>
      }
    </>
  );
};

