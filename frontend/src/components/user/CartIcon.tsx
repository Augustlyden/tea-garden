import { ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from '../../css/header.module.css';
import { MiniCart } from './MiniCart';

export const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

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

