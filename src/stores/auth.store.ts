import { create } from "zustand";
import api from "@/lib/axios";

type User = {
  id: number;
  email: string;
  role?: string;
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

  login: (email: string, password: string) => Promise<void>;
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

  // =========================
  // SET ACCESS TOKEN
  // =========================
  setAccessToken: (token) => {
    console.log("🟡 [setAccessToken] called:", token);

    if (token) {
      localStorage.setItem("accessToken", JSON.stringify(token));
      console.log("💾 [setAccessToken] saved to localStorage");
    } else {
      localStorage.removeItem("accessToken");
      console.log("🧹 [setAccessToken] removed from localStorage");
    }

    set({ accessToken: token });

    console.log("🟢 [setAccessToken] state updated");
  },

  // =========================
  // SET REFRESH TOKEN
  // =========================
  setRefreshToken: (token) => {
    console.log("🟡 [setRefreshToken] called:", token);

    if (token) {
      localStorage.setItem("refreshToken", JSON.stringify(token));
      console.log("💾 [setRefreshToken] saved to localStorage");
    } else {
      localStorage.removeItem("refreshToken");
      console.log("🧹 [setRefreshToken] removed from localStorage");
    }

    set({ refreshToken: token });

    console.log("🟢 [setRefreshToken] state updated");
  },

  setUser: (user) => {
    console.log("👤 [setUser] called:", user);
    set({ user });
  },

  // =========================
  // LOGIN
  // =========================
  login: async (email, password) => {
    // console.log("🚀 [login] started", { email, password });

    set({ loading: true });

    try {
      const res = await api.post("/auth-onecomm/login", {
        email,
        password,
      });

      // console.log("📡 [login] response:", res.data);

      const { access_token, refresh_token } = res.data.data;

      // console.log("🔐 [login] tokens received:", {
      //   access_token,
      //   refresh_token,
      // });

      get().setAccessToken(access_token);
      get().setRefreshToken(refresh_token);

      // console.log("➡️ [login] calling fetchProfile...");

      await get().fetchProfile();

      // console.log("✅ [login] completed");
    } catch (err) {
      console.error("❌ [login] error:", err);
    } finally {
      set({ loading: false });
      // console.log("🏁 [login] loading=false");
    }
  },

  // =========================
  // FETCH PROFILE
  // =========================
  fetchProfile: async () => {
    // console.log("📡 [fetchProfile] called");

    const token = get().accessToken;

    // console.log("🔑 [fetchProfile] token:", token);

    if (!token) {
      // console.log("⛔ [fetchProfile] no token, aborting");
      return;
    }

    set({ loading: true });

    try {
      const res = await api.get("/auth-onecomm/profile");

      // console.log("✅ [fetchProfile] response:", res.data);

      set({ user: res.data });

      // console.log("👤 [fetchProfile] user set");
    } catch (err) {
      console.error("❌ [fetchProfile] FAILED:", err);

      get().logout();
    } finally {
      set({ loading: false });
      // console.log("🏁 [fetchProfile] loading=false");
    }
  },

  // =========================
  // REFRESH TOKEN
  // =========================
  refreshAuth: async () => {
    // console.log("🔄 [refreshAuth] called");

    try {
      const refreshToken = get().refreshToken;

      // console.log("🔑 [refreshAuth] refreshToken:", refreshToken);

      if (!refreshToken) {
        // console.log("⛔ [refreshAuth] no refresh token");
        return null;
      }

      const res = await api.post("/auth-onecomm/refresh", {
        refreshToken,
      });

      // console.log("📡 [refreshAuth] response:", res.data);

      const newAccessToken = res.data.accessToken;

      // console.log("🆕 [refreshAuth] new accessToken:", newAccessToken);

      get().setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (err) {
      console.error("❌ [refreshAuth] FAILED:", err);

      get().logout();

      return null;
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: () => {
    // console.log("🚪 [logout] called");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });

    // console.log("🧹 [logout] state cleared");
  },

  // =========================
  // INIT
  // =========================
  init: () => {
    // console.log("🔥 [init] CALLED");

    const rawAccess = localStorage.getItem("accessToken");
    const rawRefresh = localStorage.getItem("refreshToken");

    // console.log("📦 [init] raw localStorage:", {
    //   rawAccess,
    //   rawRefresh,
    // });

    const accessToken = rawAccess ? JSON.parse(rawAccess) : null;
    const refreshToken = rawRefresh ? JSON.parse(rawRefresh) : null;

    // console.log("🔓 [init] parsed tokens:", {
    //   accessToken,
    //   refreshToken,
    // });

    set({
      accessToken,
      refreshToken,
      initialized: true,
    });

    // console.log("🟢 [init] state updated (initialized=true)");

    if (accessToken) {
      // console.log("➡️ [init] calling fetchProfile...");
      get().fetchProfile();
    } else {
      // console.log("⛔ [init] no accessToken, skipping profile");
    }
  },
}));
