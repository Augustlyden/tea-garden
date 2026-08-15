export interface AdminProductResponse {
  productId: number;
  productName: string;
  categoryId: number;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
  isAvailable: boolean;
  categoryName: string;
  isDeleted: boolean;
}

export interface AdminProductInput {
  productId?: number;
  productName: string;
  categoryId: number;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
  isAvailable?: boolean;
  isDeleted?: boolean;
}

export interface ProductFormProps {
  initialData?: AdminProductResponse;
  onSubmit: (FormData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export interface ProductListProps {
  products: AdminProductResponse[];
}

export interface ProductProps {
  product: AdminProductResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CategoryResponse {
  id: number;
  type: string;
}

export interface CategorySelectProps {
  value: number | 'all' | '';
  onChange: (categoryId: string) => void;
  includeAll: boolean;
  disabled: boolean;
}

export interface ProductDetailProps {
  product: AdminProductResponse;
  onClick: () => void;
}