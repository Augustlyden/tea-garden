import { useState } from "react";
import { useCart } from "../../context/CartContext";
import type { CartItemProps } from "../../types/cartTypes";
import styles from '../../css/cartItem.module.css';
import { Plus, Minus, X } from 'lucide-react';
import { Link } from "react-router-dom";

export const CartItem = ({ item }: CartItemProps) => {
  const { addToCart, removeFromCart, decreaseQuantity } = useCart();
  const [error, setError] = useState('');

  const handleIncrease = async (productId: number) => {
    try {
      await addToCart(productId);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromCart(id);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  };

  const handleDecrease = async (id: number) => {
    try {
      await decreaseQuantity(id);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  };

  return (
    <article className={`${styles.itemContainer} ${(!item.isAvailable || item.isDeleted) ? styles.unavailable : ''}`}>
      <Link to={`/shop/products/${item.productId}`} className={styles.productLink}>
        <div className={styles.imgContainer}>
          {item.imgUrl ? (
            <img className={styles.img} src={item.imgUrl} alt={item.productName} />
          ) : (
            <div className={styles.imgPlaceholder}>🍃</div>
          )}
          {(!item.isAvailable || item.isDeleted) && (
            <span className={styles.unavailableBadge}>Finns ej i lager</span>
          )}
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.itemInfo}>
            <h3 className={styles.name}>{item.productName}</h3>
            <p className={styles.subTotal}>{item.subTotal} kr</p>
          </div>
        </div>
      </Link>

      <div className={styles.controlsContainer}>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.quantityBtn} 
            onClick={() => handleDecrease(item.cartId)}
          >
            <Minus width={14} strokeWidth={2.5}/>
          </button>
          <span className={styles.quantityText}>{item.quantity}</span>
          <button 
            disabled={!item.isAvailable || item.isDeleted}   
            className={styles.quantityBtn}
            onClick={() => handleIncrease(item.productId)}
          >
            <Plus width={14} strokeWidth={2.5}/>
          </button>
        </div>
      </div>
      
      <button className={styles.remove} onClick={() => handleRemove(item.cartId)}>
        <X width={16} strokeWidth={2.2}/>
      </button>

      {error && <p className="error">{error}</p>}
    </article>
  );
};
