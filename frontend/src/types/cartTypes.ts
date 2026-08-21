export interface CartResponse {
  cartId?: number;
  productId: number;
  quantity: number;
  cartToken: string;
}

export interface CartWithProductResponse {
  cartId: number;
  productId: number;
  quantity: number;
  cartToken: string;
  productName: string;
  price: number;
  imgUrl: string;
  isAvailable: boolean;
  isDeleted: boolean;
  subTotal: number;
}

export interface CartContextType {
  cart: CartWithProductResponse[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  decreaseQuantity: (id: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
}

export interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CartItemProps {
  item: CartWithProductResponse;
}