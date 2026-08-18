import { useEffect, useState } from "react";
import type { AdminProductResponse } from "../../types/productTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/admin/productService";
import { ProductDetails } from "../../components/admin/ProductDetails";
import styles from '../../css/productDetail.module.css';
import { ProductForm } from "../../components/admin/ProductForm";
import { Sidebar } from "../../components/admin/Sidebar";
import { ChevronLeft } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState<AdminProductResponse>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError('');
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

  const handleUpdate = async (formData: FormData) => {
    try {
      const updated = await productService.updateProduct(Number(id), formData);
      setProduct(updated.data);
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError('');
      await productService.deleteProduct(Number(id));
      navigate('/admin/products');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <div>Laddar...</div>
  }

  if (!product) {
  return <p>Produkten kunde inte hittas.</p>;
  }

  return (
    <main>
      <Sidebar />
      <Link className={styles.back} to={'/admin/products'}>
        <ChevronLeft size={18} strokeWidth={2.5} /> Tillbaka
      </Link>
      <section className={!isEditing ? `${styles.detailContainer}` : ""}>
        {!isEditing ? (
          <>
            <ProductDetails 
              product={product}
              onClick={() => { 
                setIsEditing(true);
                setError('');
              }}
              onDelete={handleDelete}
              disabled={isDeleting} />
          </>
        ) : (
          <ProductForm initialData={product} onCancel={() => {setIsEditing(false)}} onSubmit={handleUpdate}/>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
};
