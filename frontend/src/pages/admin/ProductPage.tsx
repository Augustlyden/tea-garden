import { useEffect, useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductList } from "../../components/admin/ProductList";
import type { AdminProductResponse } from "../../types/productTypes";
import styles from '../../css/product.module.css';
import { CategorySelect } from "../../components/shared/CategorySelect";
import { Sidebar } from "../../components/admin/Sidebar";
import { Spinner } from "../../components/shared/Spinner";

export const ProductPage = () => {
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setError('');
        const productsData = await productService.getAllProducts();
        setProducts(productsData.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesAvailability = 
      filter === 'all' ||
      (filter === 'available' && p.isAvailable) ||
      (filter === 'unavailable' && !p.isAvailable);

    const macthedCategory =
      categoryFilter === 'all' || p.categoryId === categoryFilter

    return matchesAvailability && macthedCategory;
  });

  return (
    <>
      <Sidebar />
      {isLoading ? (
        <Spinner />
      ) : (
      <main>
        <div className={styles.filterWrapper}>
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
  
        <ProductList products={filteredProducts}/>
        {error && <p className="error">{error} <br /> Prova att ladda om sidan.</p>}
      </main>
    )}
    </>
  );
};
