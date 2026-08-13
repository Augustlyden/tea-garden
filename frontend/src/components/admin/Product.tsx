import type { ProductProps } from "../../types/productTypes";
import styles from '../../css/product.module.css';

export const Product = ({ product }: ProductProps) => {
  return (
    <>
      <h2 className={styles.title}>{product.productName}</h2>
      <h3 className={styles.category}>{product.categoryName}</h3>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={`${import.meta.env.VITE_IMG_URL}${product.imgUrl}`}/>
      </div>
      <div className={styles.productInfo}>
        <p className={styles.paragraph}>
          Pris: <span className={styles.span}>{product.price}</span>
        </p>
        <p className={styles.paragraph}>
          Lagersaldo: <span className={styles.span}>{product.inStock}</span>
        </p>
        <p className={styles.paragraph}>
          Tillgänglig: <span className={styles.span}>{product.isAvailable ? 'Ja' : 'Nej'}</span>
        </p>
      </div>
    </>
  );
};
