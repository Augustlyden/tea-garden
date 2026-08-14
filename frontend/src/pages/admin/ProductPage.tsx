import { useEffect, useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductList } from "../../components/admin/ProductList";
import type { AdminProductResponse } from "../../types/productTypes";
import styles from '../../css/product.module.css';

export const ProductPage = () => {
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.data);
        setError('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  if (isLoading) {
    return <div>Laddar...</div>
  }

  const filteredProducts = products.filter(p => {
    if (filter === 'available') return p.isAvailable;
    if (filter === 'unavailable') return !p.isAvailable;
    return true;
  });

  return (
    <main>
      <div className={styles.inputGroup}>
        <input 
          className={styles.radio} 
          type="radio" 
          id="filter-all" 
          name="availability" 
          defaultChecked 
          onChange={() => setFilter('all')}
        />
        <label className={styles.label} htmlFor="filter-all">Alla</label>

        <input 
          className={styles.radio} 
          type="radio" 
          id="filter-available" 
          name="availability" 
          onChange={() => setFilter('available')}
        />
        <label className={styles.label} htmlFor="filter-available">I lager</label>

        <input 
          className={styles.radio} 
          type="radio" 
          id="filter-unavailable" 
          name="availability" 
          onChange={() => setFilter('unavailable')}
        />
        <label className={styles.label} htmlFor="filter-unavailable">Ej i lager</label>
      </div>
      <ProductList products={filteredProducts}/>
      {error && <p className="error">{error}</p>}
    </main>
  );
};
