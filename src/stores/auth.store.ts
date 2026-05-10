import { create } from "zustand";
import Cookies from "js-cookie";

import api from "@/lib/axios";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;

  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: User | null) => void;

  fetchProfile: () => Promise<void>;
  refreshAuth: () => Promise<string | null>;
  logout: () => void;
  init: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  initialized: false,

  setAccessToken: token => {

    set({ accessToken: token });
  },

  setRefreshToken: token => {
    if (token) {
      Cookies.set("refreshToken", token, {
        path: "/",
        sameSite: "lax",
      });
    } else {
      Cookies.remove("refreshToken", { path: "/" });
    }

    set({ refreshToken: token });
  },

  setUser: user => {

    if (user) {
      Cookies.set("user", JSON.stringify(user), {
        path: "/",
        sameSite: "lax",
      });
    } else {
      Cookies.remove("user", { path: "/" });
    }

    set({ user });
  },

  fetchProfile: async () => {
    const token = get().accessToken;

    if (!token) return;

    set({ loading: true });

    try {
      const res = await api.get("/auth-onecomm/profile");
      set({ user: res.data.data });
    } catch (err) {
      console.error("fetchProfile failed:", err);
      get().logout();
    } finally {
      set({ loading: false });
    }
  },

  refreshAuth: async () => {
    try {
      const refreshToken =
        get().refreshToken ?? Cookies.get("refreshToken");

      if (!refreshToken) return null;

      const res = await api.post("/auth/refresh", {
        refreshToken
      });

      const newAccessToken = res.data.accessToken;
      const newRefreshToken = res.data.refreshToken;

      console.log('authstore accessToken', newAccessToken);
      console.log('authstore refresh', newRefreshToken);

      get().setAccessToken(newAccessToken);
      get().setRefreshToken(newRefreshToken);

      return newAccessToken;
    } catch (err) {
      console.error("refreshAuth failed:", err);
      get().logout();

      return null;
    }
  },

  logout: async () => {
    const refreshToken = get().refreshToken;
    const res = await api.post('/auth/logout', { refreshToken });

    if (res.status === 201) {
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("user", { path: "/" });
    }



    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },

  init: () => {
    // const accessToken = Cookies.get("accessToken") ?? null;
    const refreshToken = Cookies.get("refreshToken") ?? null;

    // api.post('/auth/refresh', {
    //   refreshToken
    // })
    // .then(res => {
    //   console.log('token data authstore', res.data);
    // })
    // .catch(error => {
    //   console.log(error);
    // })


    set({
      refreshToken,
      initialized: true,
    });

    // if (accessToken) {
    //   get().fetchProfile();
    // }
  },
}));