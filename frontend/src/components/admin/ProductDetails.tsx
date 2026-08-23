import type { ProductDetailProps } from "../../types/productTypes";
import styles from '../../css/productDetail.module.css';
import { Pencil, Trash2 } from 'lucide-react';
import { attributes } from "../../utils/attributesFormatter";

export const ProductDetails = ( {product, onClick, onDelete, disabled}: ProductDetailProps ) => {
  const productAttributes = attributes(product.attributes, product.categoryName);
  
  return (
    <>
      <section className={styles.mediaColumn}>
        <div className={styles.imgContainer}>
          {product.imgUrl ? (
            <img 
              className={styles.img} 
              src={product.imgUrl} 
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
            <button 
              className={`${styles.iconButton} ${styles.editButton}`}   
              onClick={onClick} 
              title="Redigera produkt" 
              aria-label="Redigera produkt"
            >
              <Pencil size={18} strokeWidth={2.2}/>
            </button>

            <button
              className={`${styles.iconButton} ${styles.deleteButton}`}
              title="Radera produkt"
              aria-label="Radera produkt"
              disabled={disabled}
              onClick={() => {
                if (window.confirm(`Är du säker på att du vill radera ${product.productName}?`)) {
                  onDelete();
                }
              }}
            >
              <Trash2 size={18} strokeWidth={2.2}/>  
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
