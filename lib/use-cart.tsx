"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "./types";
import { products } from "./products";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  validateAndCleanCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Filtrar produtos que ainda têm estoque
        const validCart = parsedCart.filter((item: CartItem) => {
          const product = products.find(p => p.id === item.id);
          return product && product.stock > 0;
        });
        setCart(validCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (item: CartItem) => {
    // Verificação de segurança: encontrar o produto e verificar estoque
    const product = products.find(p => p.id === item.id);
    if (!product || product.stock <= 0) {
      console.warn("Tentativa de adicionar produto sem estoque ao carrinho:", item);
      return;
    }

    setCart((prevCart) => {
      // Check if item already exists in cart (with same id, size, and color)
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItemIndex !== -1) {
        // If item exists, update quantity but respect stock limit
        const updatedCart = [...prevCart];
        const newQuantity = Math.min(
          updatedCart[existingItemIndex].quantity + item.quantity,
          product.stock
        );
        updatedCart[existingItemIndex].quantity = newQuantity;
        return updatedCart;
      } else {
        // If item doesn't exist, add it to cart with quantity limited by stock
        const limitedQuantity = Math.min(item.quantity, product.stock);
        return [...prevCart, { ...item, quantity: limitedQuantity }];
      }
    });
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
          )
      )
    );
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    // Verificação de segurança: encontrar o produto e verificar estoque
    const product = products.find(p => p.id === item.id);
    if (!product) {
      console.warn("Produto não encontrado:", item.id);
      return;
    }

    // Limitar a quantidade pelo estoque disponível
    const limitedQuantity = Math.min(Math.max(1, quantity), product.stock);

    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
          ? { ...cartItem, quantity: limitedQuantity }
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const validateAndCleanCart = () => {
    setCart((prevCart) => {
      const validCart = prevCart.filter((item) => {
        const product = products.find(p => p.id === item.id);
        return product && product.stock > 0;
      });
      return validCart;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, validateAndCleanCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
