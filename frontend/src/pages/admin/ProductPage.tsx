import { useEffect, useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductList } from "../../components/admin/ProductList";
import type { AdminProductResponse, CategoryResponse } from "../../types/productTypes";
import styles from '../../css/product.module.css';

export const ProductPage = () => {
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories(),
        ]);
        setProducts(productsData.data);
        setCategories(categoriesData.data);
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
    const matchesAvailability = 
      filter === 'all' ||
      (filter === 'available' && p.isAvailable) ||
      (filter === 'unavailable' && !p.isAvailable);

    const macthedCategory =
      categoryFilter === 'all' || p.categoryId === Number(categoryFilter)

    return matchesAvailability && macthedCategory;
  });

  return (
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
          <select 
            id="category-select" 
            className={styles.select}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Alla kategorier</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.type}</option>
            ))}
          </select>
        </div>

      </div>

      <ProductList products={filteredProducts}/>
      {error && <p className="error">{error}</p>}
    </main>
  );
};
