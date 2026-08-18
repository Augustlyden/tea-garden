import { Link } from "react-router-dom";
import styles from '../../css/product.module.css';
import type { UserProductListProps } from "../../types/productTypes";
import { UserProductCard } from "./UserProductCard";

export const UserProductList = ({ products }: UserProductListProps) => {
  return (
    <div>
      <section className={styles.container}>
        {products.map(product => (
          <article className={styles.card} key={product.productId}>
            <Link to={`/shop/products/${product.productId}`}>
              <UserProductCard product={product}/> 
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};