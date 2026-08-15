import { useState } from "react";
import { type AdminProductInput, type ProductFormProps } from "../../types/productTypes";
import { CategorySelect } from "../shared/CategorySelect";

const emptyProduct: AdminProductInput = {
  productName: '',
  categoryId: 0,
  price: 0,
  inStock: 0,
  imgUrl: null,
  desc: null,
  attributes: null,
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formValues, setFormValues] = useState<AdminProductInput>(initialData ?? emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  /* const [attributes, setAttributes] = useState([]); */
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues.price <= 0) {
      setError('Pris måste vara mer än 0');
      return;
    }

    if (formValues.inStock < 0) {
      setError('Lagersaldo får inte vara mindre än 0');
      return;
    }
    setError('');

    const data = new FormData();
    data.append('productName', formValues.productName);
    data.append('categoryId', String(formValues.categoryId));
    data.append('price', String(formValues.price));
    data.append('inStock', String(formValues.inStock));
    data.append('desc', formValues.desc ?? '');
    data.append('attributes', JSON.stringify(formValues.attributes ?? {}));
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormValues(prev => ({
      ...prev, 
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>{initialData ? 'Redigera Produkt' : 'Skapa Produkt'}</h1>

        <label htmlFor="productName">Produkt namn</label>
        <input 
          type="text" 
          name="productName" 
          onChange={handleChange} 
          value={formValues.productName} 
          id="productName"
          disabled={isLoading}
        />

        <CategorySelect 
          value={formValues.categoryId} 
          includeAll={false} 
          onChange={(categoryId) => setFormValues(prev => ({ ...prev, categoryId: Number(categoryId)}))} 
          disabled={isLoading}
        />
        <label htmlFor="price">Pris</label>
        <input 
          type="number" 
          name="price" 
          value={formValues.price} 
          onChange={handleChange}
          id="price"
          disabled={isLoading}
        />

        <label htmlFor="inStock">Antal i lager</label>
        <input 
          type="number" 
          name="inStock" 
          value={formValues.inStock} 
          onChange={handleChange}
          id="inStock" 
          disabled={isLoading} 
        />

        <label htmlFor="desc">Beskrivning</label>
        <textarea
          name="desc" 
          onChange={handleChange} 
          value={formValues.desc ?? ''}
          id="desc" 
          disabled={isLoading} 
        />

        <label htmlFor="attributes">Egenskaper</label>
        <textarea 
          id="attributes" 
          name="attributes"
          placeholder='{"Smak": "Citron"}'
          onChange={handleChange}
          disabled={isLoading}
          />

        <label htmlFor="image">Bild</label>
        <input 
          type="file" 
          name="image" 
          id="image" 
          onChange={handleFileChange} 
          accept="image/*"
          disabled={isLoading}
        />

        {error && <p className="error">{error}</p>}
        <div>
          <button disabled={isLoading} type="submit">{initialData ? 'Spara' : 'Skapa'}</button>
          <button disabled={isLoading} onClick={onCancel}>Avbryt</button>
        </div>
      </form>
    </>
  );
};
