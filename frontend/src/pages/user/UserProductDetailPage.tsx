import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { UserProductResponse } from "../../types/productTypes";
import { productService } from "../../services/admin/productService";
import { ChevronLeft } from 'lucide-react';
import styles from '../../css/productDetail.module.css';
import { UserProductDetails } from "../../components/user/UserProductDetails";
import { Header } from "../../components/user/Header";

export const UserProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<UserProductResponse>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getUserProductById(Number(id));
        setProduct(data.data);
        setError('');
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
    <>
      <Header />
      <main>
        <Link className={styles.back} to={'/shop/products'}>
          <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
        </Link>
        <section className={styles.detailContainer}>
          <UserProductDetails product={product}/>
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    </>
  );
};
