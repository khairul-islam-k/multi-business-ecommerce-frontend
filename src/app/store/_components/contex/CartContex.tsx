"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../../../templates/electronic/_components/data/products";


type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem("cart");

      if (rawCart) {
        setItems(JSON.parse(rawCart));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      // Ignore localStorage error
    }
  }, [items]);

  const add = (product: Product) => {
    console.log('product',product)
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          qty: 1,
        },
      ];
    });
  };

  const remove = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== id),
    );
  };

  const setQty = (id: string, qty: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === id
          ? {
              ...item,
              qty: Math.max(1, qty),
            }
          : item,
      ),
    );
  };

  const clear = () => {
    setItems([]);
  };

  const count = items.reduce((totalQty, item) => {
    return totalQty + item.qty;
  }, 0);

  const total = items.reduce((totalPrice, item) => {
    return totalPrice + item.qty * item.product.price;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        setQty,
        clear,
        count,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}