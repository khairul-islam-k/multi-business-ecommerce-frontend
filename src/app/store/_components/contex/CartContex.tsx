"use client";

import { templateAuthApi } from "@/lib/api/template-auth";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { CustomerCartResponse } from "@/types/template/add-cart";
import { Customer } from "@/types/template/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = Pick<Customer, "id" | "name" | "email" | "phone"> & {
  accessToken: string;
  refreshToken: string;
};

type CartContextType = {
  LOginUser: (values: User) => void;
  user: User | null;
  handleLogout: () => Promise<void>;
  getAuthUser: () => User | null;
  newAccessToken: () => Promise<string | null>;
  getTotalCartQuantity: (cart?: CustomerCartResponse | null) => number;
};

const AUTH_USER_KEY = "auth_user";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const LOginUser = (values: User) => {
    setUser(values);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(values));
  };

  const getAuthUser = (): User | null => {
    if (typeof window === "undefined") {
      return null;
    }
    
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  };

  const clearAuthUser = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  useEffect(() => {
    const loginUser = getAuthUser();
    setUser(loginUser);
  }, []);

  const handleLogout = async () => {
    const currentUser = user ?? getAuthUser();

    try {
      if (currentUser?.refreshToken) {
        console.log('current', currentUser.refreshToken);
        await templateAuthApi.logOut({
          refreshToken: currentUser.refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout failed:", getWebErrorMessage(error));
    } finally {
      clearAuthUser();

      router.push("/store/login");
      router.refresh();
    }
  };

  const newAccessToken = async () => {
    try {
      const currentUser = user ?? getAuthUser();

      if (!currentUser?.refreshToken) {
        clearAuthUser();
        return null;
      }

      const response = await templateAuthApi.refreshAuth({
        refreshToken: currentUser.refreshToken,
      });

      const updatedUser: User = {
        ...currentUser,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      LOginUser(updatedUser);

      return response.accessToken;
    } catch (error) {
      console.error("Refresh token failed:", getWebErrorMessage(error));

      clearAuthUser();

      return null;
    }
  };


  const getTotalCartQuantity = (cart?: CustomerCartResponse | null) => {
    return (
      cart?.items?.reduce((total, item) => {
        const quantity = Number(item.quantity);

        return total + (Number.isNaN(quantity) ? 0 : quantity);
      }, 0) ?? 0
    );
  };

  return (
    <CartContext.Provider
      value={{
        LOginUser,
        getAuthUser,
        user,
        handleLogout,
        newAccessToken,
        getTotalCartQuantity,
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