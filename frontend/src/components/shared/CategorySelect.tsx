import { useEffect, useState } from "react";
import type { CategoryResponse, CategorySelectProps } from "../../types/productTypes";
import { productService } from "../../services/admin/productService";
import styles from '../../css/product.module.css';

export const CategorySelect = ({ value, onChange, includeAll, disabled}: CategorySelectProps ) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categories = await productService.getAllCategories();
        setCategories(categories.data);
      } catch (error) {
        console.error('Misslyckades att hämta kategorier:', error);
      }
    }
    fetchAllCategories()
  }, []);
  return (
    <select 
      disabled={disabled} 
      className={styles.select} 
      value={String(value)} 
      onChange={(e) => onChange( e.target.value === 'all' ? e.target.value : Number(e.target.value))}
    >
      <option value="0">Välj kategori</option>
      {includeAll && <option value="all">Alla kategorier</option>}
      {categories.map(c => (
        <option key={c.id} value={c.id}>{c.type}</option>
      ))}
    </select>
  );
};
