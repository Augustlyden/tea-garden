import { useState } from "react";
import { productService } from "../../services/admin/productService";
import { ProductForm } from "../../components/admin/ProductForm";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/admin/Sidebar";

export const CreateProductPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (formData: FormData) => {
    try {
      const created = await productService.createProduct(formData);
      navigate(`/admin/products/${created.data.productId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    }
  }
  return (
    <main>
      <Sidebar />
      <ProductForm onSubmit={handleCreate} onCancel={() => navigate('/admin/products')}/>
      {error && <p className="error">{error}</p>}
    </main>
  );
};
