import styles from '../../css/orderList.module.css';
import { ScrollText, BookMarked } from 'lucide-react';
import { type StatusHistoryResponse, type OrderCardProps } from '../../types/orderTypes';
import { useState } from 'react';
import { orderService } from '../../services/admin/orderService';
import { formatDate } from '../../utils/formater';
import { Link } from 'react-router-dom';

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

  const renderHistoryContent = () => {
    if (isLoading) {
      return <div>Laddar...</div>
    } else if (error) {
      return <p className="error">{error}</p>
    } else {
      return (
        history?.map(h => (
            <div key={h.id} className={styles.historyRow}>
              <span className={styles.historyStatus}>{h.status}</span>
              <span className={styles.historyDate}>{formatDate(h.changedAt)}</span>
              <span className={styles.historyAdmin}>
                Bytt av: <strong>{h.admin ? h.admin : 'system'}</strong>
              </span>
            </div>
        ))
      );
    }
  }

  return (
    <>
      <div className={styles.orderCardMain}>
        <Link to={`/admin/orders/${order.orderId}`} className={styles.cardLink}>
          <div className={styles.imgContainer}>
            <ScrollText className={styles.img} color='#1C5D3B' strokeWidth={1.5} size={28}/>
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.headerInfo}>
              <h2 className={styles.title}>Beställning #{order.orderId}</h2>
              <span className={`${styles.statusBadge} ${styles[order.currentStatus.toLowerCase()]}`}>
                {order.currentStatus}
              </span>
            </div>

            <div className={styles.productInfo}>
              <p className={styles.paragraph}> Namn: <span className={styles.span}>{order.customerName}</span></p>
              <p className={styles.paragraph}> Summa: <span className={styles.totalSpan}>{order.totalAmount} kr</span></p>
            </div>
          </div>
        </Link>
        <div className={styles.actionRow}>
          <button onClick={fetchHistory} className={`${styles.historyButton} ${isExpanded ? styles.active : ''}`}>
            {isExpanded ? 'Dölj historik' : 'Visa historik'} 
            <BookMarked width={16} strokeWidth={2.2}/>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.historyWrapper}>
          <h4 className={styles.historyTitle}>Statushistorik</h4>
          <div className={styles.historyContainer}>
            {renderHistoryContent()}
          </div>
        </div>
      )}
    </>
  );
};

