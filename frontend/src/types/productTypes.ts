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

export interface ProductDetailProps {
  product: AdminProductResponse;
  onClick: () => void;
}