export type Categories = 'Te' | 'Tillbehör';

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
  categoryName: Categories;
  isDeleted: boolean;
}

export interface UserProductResponse {
  productId: number;
  productName: string;
  categoryId: number;
  price: number;
  inStock: number;
  imgUrl: string;
  desc: string;
  attributes: Record<string, any> | null;
  categoryName: Categories;
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
}

export interface ProductListProps {
  products: AdminProductResponse[];
}

export interface UserProductListProps {
  products: UserProductResponse[];
}

export interface ProductCardProps {
  product: AdminProductResponse;
}

export interface UserProductCardProps {
  product: UserProductResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CategoryResponse {
  id: number;
  type: string;
}

export interface CategorySelectProps {
  value: number | 'all' | 0;
  onChange: (categoryId: number | 'all') => void;
  includeAll: boolean;
  disabled: boolean;
}

export interface ProductDetailProps {
  product: AdminProductResponse;
  onClick: () => void;
  onDelete: () => void;
  disabled: boolean;
}