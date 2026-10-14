import { useEffect, useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductList } from "../../components/admin/ProductList";
import type { AdminProductResponse, ImportReport } from "../../types/productTypes";
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
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<null | ImportReport>(null);

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

  const importProducts = async (format: 'csv' | 'xml') => {
    try {
      setIsImporting(true);
      setImportReport(null);
      setError('');
      const report = await productService.importProducts(format);
      setImportReport(report.data);
      const productsData = await productService.getAllProducts();
      setProducts(productsData.data);
    } catch (error) { 
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsImporting(false);
    }
  };

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

          <div className={styles.importButtons}>
            <button 
              className={styles.importButton}
              onClick={() => importProducts('csv')}
              disabled={isImporting}
            >
              Importera CSV
            </button>
            <button 
              className={styles.importButton}
              onClick={() => importProducts('xml')} 
              disabled={isImporting}
            >
              Importera XML
            </button>
          </div>
  
        </div>

        <div className={styles.importReport}>
          {isImporting && <Spinner />}
          {importReport && (
            <div>
              <h3 className={styles.sectionTitle}>Importrapport</h3>
              <p className={styles.paragraph}>Import av {importReport.format.toUpperCase()} färdig!</p>
              <p className={styles.paragraph}>Totalt: {importReport.total}</p>
              <p className={styles.paragraph}>Skapade: {importReport.created}</p>
              <p className={styles.paragraph}>Uppdaterade: {importReport.updated}</p>
              {importReport.skipped.length > 0 && (
                <div>
                  <p className={styles.paragraph}>Skippade: {importReport.skipped.length}</p>
                  <ul className={styles.skippedList}>
                    {importReport.skipped.map((item, index) => (
                      <li key={index} className={styles.skippedItem}>
                        SKU: {item.sku}, Orsak: {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <ProductList products={filteredProducts}/>
        {error && <p className="error">{error} <br /> Prova att ladda om sidan.</p>}
      </main>
    )}
    </>
  );
};
