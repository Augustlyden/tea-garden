import styles from '../../css/cart.module.css';
import { useCart } from "../../context/CartContext";
import type { MiniCartProps } from "../../types/cartTypes";
import { Link } from 'react-router-dom';
import { CartItem } from './CartItem';
import { Spinner } from '../shared/Spinner';

export const MiniCart = ( {isOpen, onClose }: MiniCartProps ) => {
  const { cart, totalPrice, isLoading } = useCart();

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`} 
        onClick={onClose}
      />
      <div className={`${styles.cartContainer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitel}>Din Varukorg</h2>
          <button className={styles.close} onClick={onClose} aria-label="Stäng varukorg">
            &times;
          </button>
        </div>

        <div className={styles.itemsList}>
          {isLoading ? (
            <Spinner />
          ) : cart.length === 0 ? (
            <p className={styles.emptyCart}>Din varukorg är tom</p>
          ) : (
            cart.map(item => <CartItem key={item.cartId} item={item} />)
          )}
        </div>

        <div className={styles.checkout}>
          <div className={styles.totalWrapper}>
            <span className={styles.totalLabel}>Totalt:</span>
            <span className={styles.totalPrice}>{totalPrice} kr</span>
          </div>
          <Link className={styles.link} to='/shop/checkout'>Till kassan</Link>
        </div>
      </div>
    </>
  );
};
