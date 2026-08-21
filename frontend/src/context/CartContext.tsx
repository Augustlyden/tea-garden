import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from 'react';
import type { CartContextType, CartWithProductResponse } from "../types/cartTypes";
import { cartService } from "../services/cartService";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within an CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartWithProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId: number) => {
    try {
      await cartService.addToCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      throw error;
    } 
  };

  const removeFromCart = async (id: number) => {
    try {
      await cartService.removeFromCart(id);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
      throw error;
    }
  };

  const decreaseQuantity = async (id: number) => {
    try {
      await cartService.decreaseQuantity(id);
      await fetchCart();
    } catch (error) {
      console.error('Failed to decrease product quantity:', error);
      throw error;
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => sum + item.subTotal, 0);

  const value = {
    cart,
    isLoading,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    removeFromCart,
    decreaseQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};