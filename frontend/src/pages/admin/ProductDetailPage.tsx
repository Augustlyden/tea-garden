import { useEffect, useState } from "react";
import type { AdminProductResponse } from "../../types/productTypes";
import { useParams } from "react-router-dom";
import { productService } from "../../services/admin/productService";
import { ProductDetails } from "../../components/admin/ProductDetails";
import styles from '../../css/productDetail.module.css';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState<AdminProductResponse>();
  const [updatedProduct, setUpdatedProduct] = useState<AdminProductResponse>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Något gick fel');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div>Laddar...</div>
  }

  if (!product) {
  return <p>Produkten kunde inte hittas.</p>;
}

  return (
    <main className={styles.detailContainer}>
      {!isEditing ? (
        <>
          <ProductDetails 
            product={product}
            onClick={() => setIsEditing(true)} />
        </>
      ) : (
        <button onClick={() => setIsEditing(false)}>Avbryt</button>
      )}
      {error && <p className="error">{error}</p>}
    </main>
  );
};
