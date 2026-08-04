export interface ProductAttributes {
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

export interface ProductInstance {
  productId: number;
  productName: string;
  categoryId: number;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
  isAvailable: boolean;
  categoryName?: string;
  isDeleted: boolean;
}

export interface UserProductInstance {
  productId: number;
  productName: string;
  categoryId: number;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
  categoryName?: string;
}

export interface ProductDatabaseRow {
  id: number;
  product_name: string;
  category_id: number;
  price: string | number;
  in_stock: number;
  img_url: string | null;
  description: string | null;
  attributes: Record<string, any> | null;
  is_available: boolean;
  type?: string;
  is_deleted: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}