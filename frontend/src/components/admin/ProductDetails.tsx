import type { ProductDetailProps } from "../../types/productTypes";
import styles from '../../css/productDetail.module.css';

export const ProductDetails = ( {product, onClick}: ProductDetailProps ) => {
  return (
    <>
      <section className={styles.mediaColumn}>
        <div className={styles.imgContainer}>
          {product.imgUrl ? (
            <img 
              className={styles.img} 
              src={`${import.meta.env.VITE_IMG_URL}${product.imgUrl}`} 
              alt={product.productName} 
            />
          ) : (
            <div className={styles.imagePlaceholder}>Ingen bild tillgänglig</div>
          )}
        </div>
      </section>

      <section className={styles.infoColumn}>
        <div className={styles.mainHeaderInfo}>
          <div className={styles.titleAndPrice}>
            <span className={styles.categoryBadge}>{product.categoryName}</span>
            <h1 className={styles.productTitle}>{product.productName}</h1>
            
            <div className={styles.priceRow}>
              <span className={styles.price}>{product.price} kr</span>
              <span className={styles.vatInfo}>inkl. moms</span>
            </div>
            <div className={styles.statusWrapper}>
              {product.isAvailable && product.inStock > 0 ? (
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
            <button className={styles.editButton} onClick={onClick}>
              Redigera Produkt
            </button>
          </div>
        </div>

        {product.desc && (
          <div className={styles.descriptionContainer}>
            <h2 className={styles.sectionTitle}>Om denna vara</h2>
            <p className={styles.descriptionText}>{product.desc}</p>
          </div>
        )}

        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className={styles.attributesContainer}>
            <h2 className={styles.sectionTitle}>Egenskaper</h2>
            <dl className={styles.attributesList}>
              {Object.entries(product.attributes).map(([key, value]) => (
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
