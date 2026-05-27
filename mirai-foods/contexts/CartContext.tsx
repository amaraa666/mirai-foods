import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, getDisplayProduct } from '@/constants/data';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    const display = getDisplayProduct(product.id);
    if (!display) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === display.id);
      if (existing) {
        return prev.map(item =>
          item.id === display.id
            ? {
                ...item,
                ...display,
                quantity: Math.min(
                  item.quantity + quantity,
                  display.quantityLeft
                ),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          ...display,
          quantity: Math.min(quantity, display.quantityLeft),
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.quantityLeft) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};