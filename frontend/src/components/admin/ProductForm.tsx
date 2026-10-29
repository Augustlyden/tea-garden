import { useState } from "react";
import { type AdminProductInput, type ProductFormProps } from "../../types/productTypes";
import { CategorySelect } from "../shared/CategorySelect";
import styles from "../../css/productForm.module.css";

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

    if (formValues.categoryId === 0) {
      setError('Välj en kategori');
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
    data.append('isAvailable', String(formValues.isAvailable));
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

  const handleCategoryChange = (categoryId: number | 'all') => {
    if (categoryId === 'all') return;
    setFormValues(prev => ({...prev, categoryId: categoryId}));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{initialData ? 'Redigera Produkt' : 'Skapa Produkt'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="productName">Produkt namn</label>
          <input 
            type="text" 
            name="productName" 
            onChange={handleChange} 
            value={formValues.productName} 
            id="productName"
            disabled={isLoading}
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Kategori</label>
            <CategorySelect 
              value={formValues.categoryId} 
              includeAll={false} 
              onChange={handleCategoryChange}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="price">Pris</label>
            <input 
              type="number" 
              name="price" 
              value={formValues.price} 
              onChange={handleChange}
              id="price"
              disabled={isLoading}
              className={styles.input}
              min={0}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="inStock">Antal i lager</label>
            <input 
              type="number" 
              name="inStock" 
              value={formValues.inStock} 
              onChange={handleChange}
              id="inStock" 
              disabled={isLoading} 
              className={styles.input}
              min={0}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="desc">Beskrivning</label>
          <textarea
            name="desc" 
            onChange={handleChange} 
            value={formValues.desc ?? ''}
            id="desc" 
            disabled={isLoading} 
            className={`${styles.input} ${styles.textarea}`}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="attributes">Egenskaper</label>
          <textarea 
            id="attributes" 
            name="attributes"
            placeholder='{"Smak": "Citron"}'
            onChange={handleChange}
            disabled={isLoading}
            className={`${styles.input} ${styles.textarea} ${styles.codeFont}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="image">Bild</label>
          <input 
            type="file" 
            name="image" 
            id="image" 
            onChange={handleFileChange} 
            accept="image/*"
            disabled={isLoading}
            className={`${styles.input} ${styles.fileInput}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Tillgänglig</label>
          <label className={styles.label}>
            <input 
              type="radio" 
              name="isAvailable"
              value="true"
              checked={formValues.isAvailable === true}
              onChange={() => setFormValues(prev => ({ ...prev, isAvailable: true }))}
              disabled={isLoading}
              className={styles.radio}
            />
            Ja
          </label>
          <label className={styles.label}>
            <input 
              type="radio"
              name="isAvailable"
              value="false"
              checked={formValues.isAvailable === false}
              onChange={() => setFormValues(prev => ({ ...prev, isAvailable: false }))}
              disabled={isLoading}  
              className={styles.radio} 
            />
            Nej
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div className={styles.buttonGroup}>
          <button className={styles.button} disabled={isLoading} type="submit">
            {initialData ? 'Spara' : 'Skapa'}
          </button>
          <button className={styles.cancel} disabled={isLoading} onClick={onCancel}>
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
};
