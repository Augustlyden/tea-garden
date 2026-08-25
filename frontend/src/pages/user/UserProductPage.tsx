import { useEffect, useState } from "react";
import type { UserProductResponse } from "../../types/productTypes";
import { productService } from "../../services/admin/productService";
import styles from '../../css/product.module.css';
import { CategorySelect } from "../../components/shared/CategorySelect";
import { UserProductList } from "../../components/user/UserProductList";
import { Header } from "../../components/user/Header";
import { Spinner } from "../../components/shared/Spinner";

export const UserProductPage = () => {
  const [products, setProducts] = useState<UserProductResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await productService.getAllUserProducts();
        setProducts(data.data);
        setError('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    categoryFilter === 'all' || p.categoryId === categoryFilter
  );

  return (
    <>
      <Header />
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div className={styles.filter}>
            <div className={styles.selectContainer}>
              <label htmlFor="category-select" className={styles.visuallyHidden}>
                Välj kategori
              </label>
              <CategorySelect 
                value={categoryFilter} 
                onChange={setCategoryFilter} 
                includeAll={true} 
                disabled={false}
              />
            </div>
          </div>

          <UserProductList products={filteredProducts}/>

          {error && <p className="error">{error}</p>}
        </main>
      )}
    </>
  );
};

