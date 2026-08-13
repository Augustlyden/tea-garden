import { useEffect, useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductList } from "../../components/admin/ProductList";
import type { AdminProductResponse } from "../../types/productTypes";

export const ProductPage = () => {
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <main>
      <ProductList products={products}/>
      {error && <p className="error">{error}</p>}
    </main>
  );
};
