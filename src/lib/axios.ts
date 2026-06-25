import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/v1`;

export const publicApi = axios.create({
  baseURL,
});

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    console.log('api message', data);

    return data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 500) {
      if (typeof window !== "undefined") {
        window.location.href = "/internal-error";
      }

      return Promise.reject(error);
    }

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    const { refreshAuth, logout } = useAuthStore.getState();

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAuth();

      if (!newToken) throw new Error("Refresh failed");

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
