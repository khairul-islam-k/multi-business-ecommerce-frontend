"use client";

import Cookies from "js-cookie";
import { create } from "zustand";

import { authApi } from "@/lib/api/auth";
import type {
  AuthBusiness,
  AuthPayload,
  LoginPayload,
  RegisterPayload,
  SystemUser,
} from "@/lib/api/types";
import axios from "axios";
import type { PosCartItem } from "@/app/(dashboard)/admin/dashboard/pos/_components/types";

const REFRESH_TOKEN_COOKIE = "refreshToken";
const ACCESS_TOKEN_COOKIE = "accessToken";
const USER_COOKIE = "user";
const BUSINESS_COOKIE = "selectedBusiness";
const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
};

// localStore
const CART_POS_KEY = "cartPos";

const parseCookieJson = <T>(key: string): T | null => {
  const value = Cookies.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    Cookies.remove(key, COOKIE_OPTIONS);
    return null;
  }
};

type AuthState = {
  user: SystemUser | null;
  selectedBusiness: AuthBusiness | null;
  businesses: AuthBusiness[];
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;
  cartPos: PosCartItem[];

  addCartItem: (item: PosCartItem) => void;
  removeCartItem: (id: string) => void;
  updateCartItem: (itemId: string, values: Partial<PosCartItem>) => void;
  clearCart: () => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: SystemUser | null) => void;
  setSelectedBusiness: (business: AuthBusiness | null) => void;
  setBusinesses: (businesses: AuthBusiness[]) => void;
  applyAuthPayload: (payload: Partial<AuthPayload>) => void;
  logoutFromCookie: () => void;

  register: (payload: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<AuthPayload>;
  fetchProfile: () => Promise<void>;
  refreshAuth: (businessId?: string | null) => Promise<string | null>;
  selectBusiness: (businessId: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  init: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  selectedBusiness: null,
  businesses: [],
  accessToken: null,
  refreshToken: null,
  loading: false,
  initialized: false,
  cartPos: [],

  // pos Add
  addCartItem: (item) => {
    const currentCart = get().cartPos;

    const existingItem = currentCart.find((cartItem) => {
      const sameProduct = cartItem.product.id === item.product.id;
      const sameVariant = cartItem.variant?.id === item.variant?.id;

      return sameProduct && sameVariant;
    });

    let updatedCart: PosCartItem[];

    if (!existingItem) {
      updatedCart = [
        ...currentCart,
        {
          ...item,
        },
      ];
    } else {
      updatedCart = currentCart.map((cartItem) => {
        const sameProduct = cartItem.product.id === item.product.id;
        const sameVariant = cartItem.variant?.id === item.variant?.id;

        if (!sameProduct || !sameVariant) return cartItem;

        return {
          ...cartItem,
          quantity: cartItem.quantity + item.quantity,
          discountAmount: cartItem.discountAmount + item.discountAmount,
        };
      });
    }

    localStorage.setItem(CART_POS_KEY, JSON.stringify(updatedCart));

    set({
      cartPos: updatedCart,
    });
  },

  removeCartItem: (id) => {
    const currentCart = get().cartPos;

    const updatedCart = currentCart.filter((item) => item.id !== id);

    localStorage.setItem(CART_POS_KEY, JSON.stringify(updatedCart));

    set({
      cartPos: updatedCart,
    });
  },

  updateCartItem: (itemId, values) => {
    const currentCart = get().cartPos;

    const updatedCart = currentCart.map((item) =>
      item.id === itemId
        ? {
          ...item,
          ...values,
          discountAmount: Math.min(
            Number(values.discountAmount ?? item.discountAmount),
            Number(values.quantity ?? item.quantity) * item.unitPrice,
          ),
        }
        : item,
    );

    localStorage.setItem(CART_POS_KEY, JSON.stringify(updatedCart));

    set({
      cartPos: updatedCart,
    });
  },

  clearCart: () => {
    localStorage.removeItem(CART_POS_KEY);

    set({
      cartPos: [],
    });
  },

  setAccessToken: (token) => {
    if (token) {
      Cookies.set(ACCESS_TOKEN_COOKIE, token, COOKIE_OPTIONS);
    } else {
      Cookies.remove(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
    }

    set({ accessToken: token });
  },

  setRefreshToken: (token) => {
    if (token) {
      Cookies.set(REFRESH_TOKEN_COOKIE, token, COOKIE_OPTIONS);
    } else {
      Cookies.remove(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
    }

    set({ refreshToken: token });
  },

  setUser: (user) => {
    const cookiePayload = {
      id: user?.id,
      type: user?.type,
    };
    if (user) {
      Cookies.set(USER_COOKIE, JSON.stringify(cookiePayload), COOKIE_OPTIONS);
    } else {
      Cookies.remove(USER_COOKIE, COOKIE_OPTIONS);
    }

    set({ user });
  },

  setSelectedBusiness: (business) => {
    if (business) {
      Cookies.set(BUSINESS_COOKIE, JSON.stringify(business), COOKIE_OPTIONS);
    } else {
      Cookies.remove(BUSINESS_COOKIE, COOKIE_OPTIONS);
    }

    set({ selectedBusiness: business });
  },

  setBusinesses: (businesses) => set({ businesses }),

  applyAuthPayload: (payload) => {
    const { accessToken, refreshToken, user, selectedBusiness, businesses } =
      payload;

    if (accessToken !== undefined) get().setAccessToken(accessToken);
    if (refreshToken !== undefined) get().setRefreshToken(refreshToken);
    if (user !== undefined) get().setUser(user);
    if (selectedBusiness !== undefined) {
      get().setSelectedBusiness(selectedBusiness);
    }
    if (businesses !== undefined) get().setBusinesses(businesses);
  },

  register: async (payload) => {
    set({ loading: true });

    try {
      await authApi.register(payload);
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const payload = await authApi.login({
        email,
        password,
      } satisfies LoginPayload);
      get().applyAuthPayload(payload);

      return payload;
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    if (!get().accessToken) return;

    set({ loading: true });

    try {
      const profile = await authApi.me();
      get().applyAuthPayload(profile);
    } catch {
      await get().logout();
    } finally {
      set({ loading: false });
    }
  },

  refreshAuth: async (businessId) => {
    const refreshToken =
      get().refreshToken ?? Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

    if (!refreshToken) return null;

    try {
      const payload = await authApi.refresh({ refreshToken, businessId });
      get().applyAuthPayload(payload);

      return payload.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // if (status === 401) {
        //   await get().logout();
        // }
      } else {
        console.log("unknown refresh error:", error);
      }
      return null;
    }
  },

  selectBusiness: async (businessId) => {
    const refreshToken =
      get().refreshToken ?? Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

    if (!refreshToken) {
      await get().logout();
      return;
    }

    set({ loading: true });

    try {
      const payload = await authApi.selectBusiness({
        businessId,
        refreshToken,
      });

      get().applyAuthPayload(payload);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const refreshToken =
      get().refreshToken ?? Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

    set({ loading: true });

    try {
      if (refreshToken && get().accessToken) {
        await authApi.logout({ refreshToken });
      }
    } catch {
      // Local cleanup still needs to happen if the session is already invalid.
    } finally {
      Cookies.remove(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
      Cookies.remove(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
      Cookies.remove(USER_COOKIE, COOKIE_OPTIONS);
      Cookies.remove(BUSINESS_COOKIE, COOKIE_OPTIONS);

      set({
        user: null,
        selectedBusiness: null,
        businesses: [],
        accessToken: null,
        refreshToken: null,
        loading: false,
        initialized: true,
      });
    }
  },

  logoutFromCookie: () => {
    Cookies.remove(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
    Cookies.remove(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
    Cookies.remove(USER_COOKIE, COOKIE_OPTIONS);
    Cookies.remove(BUSINESS_COOKIE, COOKIE_OPTIONS);
  },

  logoutAll: async () => {
    set({ loading: true });

    try {
      if (get().accessToken) {
        await authApi.logoutAll();
      }
    } finally {
      await get().logout();
    }
  },

  init: async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;
    const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
    const selectedBusiness = parseCookieJson<AuthBusiness>(BUSINESS_COOKIE);
    const cart = localStorage.getItem(CART_POS_KEY);
    const cartPos = cart ? JSON.parse(cart) : [];

    // business

    set({
      refreshToken,
      cartPos,
      accessToken,
      selectedBusiness,
      initialized: false,
      loading: Boolean(refreshToken),
    });

    if (!refreshToken && !accessToken) {
      set({ initialized: true, loading: false });
      return;
    }

    try {
      const profile = await authApi.me();
      const { businesses, user } = profile;

      if (businesses !== undefined) get().setBusinesses(businesses);

      if (user !== undefined) {
        set({ user });
      }

      set({ initialized: true, loading: false });
    } catch {
      await get().logout();
      set({ initialized: true, loading: false });
    }
  },
}));
