import { ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from '../../css/header.module.css';
import { MiniCart } from './MiniCart';
import { useLocation } from 'react-router-dom';

export const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={styles.cartButton}
        aria-label='Öppna varukorg'
        aria-expanded={isOpen}
      >
        {totalItems > 0 && 
          <span className={styles.totalItems}>
            {totalItems}
          </span>
        }
        <ShoppingBasket className={styles.basket} width={30} strokeWidth={1.5}/>
      </button>
      <MiniCart isOpen={isOpen} onClose={() => setIsOpen(false)}/>
    </>
  );
};

