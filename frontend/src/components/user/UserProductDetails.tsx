import type { UserProductCardProps } from "../../types/productTypes";
import { attributes } from "../../utils/attributesFormatter";
import styles from '../../css/productDetail.module.css';
import { ShoppingBasket, ShoppingBag } from 'lucide-react';
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { PriceCurrency } from "./PriceCurrency";

export const UserProductDetails = ( {product}: UserProductCardProps ) => {
  const productAttributes = attributes(product.attributes);
  const { addToCart } = useCart();
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId);
      setError('');
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  }

  return (
    <>
      <section className={styles.mediaColumn}>
        <div className={styles.imgContainer}>
          {product.imgUrl ? (
            <img className={styles.img} src={product.imgUrl} alt={product.productName} />
          ) : (
            <div className={styles.imgPlaceholder}>🍃</div>
          )}
        </div>
      </section>

      <section className={styles.infoColumn}>
        <div className={styles.mainHeaderInfo}>
          <div className={styles.titleAndPrice}>
            <span className={styles.categoryBadge}>{product.categoryName}</span>
            <h1 className={styles.productTitle}>{product.productName}</h1>
            
            <PriceCurrency price={product.price}/>
            {error && <p className="error">{error}</p>}
            <div className={styles.statusWrapper}>
              {product.inStock > 0 ? (
                <span className={`${styles.statusBadge} ${styles.inStock}`}>
                  I lager ({product.inStock} st)
                </span>
              ) : (
                <span className={`${styles.statusBadge} ${styles.outOfStock}`}>
                  Ej i lager
                </span>
              )}
            </div>
            
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.iconButton} ${styles.buyButton} ${isAnimating ? styles.popEffect : ''}`}
              title="Lägg i varukorgen"
              aria-label="Lägg i varukorgen"
              onClick={() => handleAddToCart(product.productId)}
              disabled={product.inStock <= 0 || isAnimating}
            >
              {isAnimating ? (
                <span className={styles.addedText}>
                  <ShoppingBag size={18} />
                  Tillagd! <span className={styles.flyingLeaf}>🍃</span>
                </span>
              ) : (
                <>
                  <ShoppingBasket size={18} />
                  {product.inStock > 0 ? 'Lägg i varukorg' : 'Slut i lager'}  
                </>
              )}
            </button>
          </div>
        </div>

        {product.desc && (
          <div className={styles.descriptionContainer}>
            <h2 className={styles.sectionTitle}>Om denna vara</h2>
            <p className={styles.descriptionText}>{product.desc}</p>
          </div>
        )}

        {productAttributes && Object.keys(productAttributes).length > 0 && (
          <div className={styles.attributesContainer}>
            <h2 className={styles.sectionTitle}>Egenskaper</h2>
            <dl className={styles.attributesList}>
              {Object.entries(productAttributes).map(([key, value]) => (
                <div key={key} className={styles.attributeRow}>
                  <dt className={styles.attributeKey}>{key}</dt>
                  <dd className={styles.attributeValue}>{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

      </section>
    </>
  );
};
