import { useEffect, useState } from "react";
import { type SearchResponse } from "../../types/productTypes";
import { productService } from "../../services/admin/productService";
import styles from '../../css/product.module.css';
import { UserProductList } from "../../components/user/UserProductList";
import { Header } from "../../components/user/Header";
import { Spinner } from "../../components/shared/Spinner";

const PAGE_SIZE = 5;

export const UserProductPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchProducts = async () => {
      try {
        const response = await productService.searchProducts({ q: searchTerm, page, pageSize: PAGE_SIZE});
        if (!ignore) {
          setResult(response.data);
          setError('');
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Något gick fel');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => { ignore = true; }
  }, [searchTerm, page]);

  return (
    <>
      <Header />
      <main>
        <form 
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(inputValue.trim());
            setPage(1);
          }}>
            <label htmlFor="product-search" className={styles.visuallyHidden}>
              Sök produkter
            </label>
            <input 
              id="product-search"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} 
              maxLength={100}
              className={styles.searchInput}
            />
            <button className={styles.searchButton} type="submit">Sök</button>
          </form>
        {isLoading ? (
          <Spinner />
        ) : result && result.meta.total === 0 ? (
          <p className={styles.emptySearch}>Inga träffar</p>
        ) : (
          <UserProductList products={result?.products ?? []}/> 
        )}

        {result && result.meta.totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageButton} type="button" onClick={() => setPage(page - 1)} disabled={page <= 1}>
              Förgående
            </button>
            <span className={styles.pageInfo}>Sida {page} av {result.meta.totalPages}</span>
            <button className={styles.pageButton} type="button" onClick={() => setPage(page + 1)} disabled={page >= result.meta.totalPages}>
              Nästa
            </button>
          </div>
        )}
        {error && <p className="error">{error} <br /> Prova att ladda om sidan.</p>}
      </main>
    </>
  );
};

