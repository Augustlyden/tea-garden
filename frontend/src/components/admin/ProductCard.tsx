import type { ProductCardProps } from "../../types/productTypes";
import styles from '../../css/product.module.css';

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <>
      <div className={styles.imgContainer}>
        {product.imgUrl ? (
          <img className={styles.img} src={product.imgUrl} alt={product.productName} />
        ) : (
          <div className={styles.imgPlaceholder}>🍃</div>
        )}
      </div>

      <div className={styles.contentContainer}>
        
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{product.productName}</h2>
          <h3 className={styles.category}>{product.categoryName}</h3>
        </div>

        <div className={styles.productInfo}>
          <p className={styles.paragraph}>
            Pris: <span className={styles.span}>{product.price} kr</span>
          </p>
          <p className={styles.paragraph}>
            Lagersaldo: <span className={styles.span}>{product.inStock}</span>
          </p>
          <p className={styles.paragraph}>
            Tillgänglig: <span className={styles.span}>{product.isAvailable ? 'Ja' : 'Nej'}</span>
          </p>
        </div>

      </div>
    </>
  );
};
