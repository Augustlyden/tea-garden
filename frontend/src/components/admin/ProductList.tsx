import { Link } from "react-router-dom";
import styles from '../../css/product.module.css';
import type { ProductListProps } from "../../types/productTypes";
import { Product } from "./Product";

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div>
      <section className={styles.container}>
        {products.map(product => (
          <article className={styles.card} key={product.productId}>
            <Link to={`/admin/products/${product.productId}`}>
              <Product product={product}/>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};