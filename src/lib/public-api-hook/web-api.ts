import axios, {
  AxiosHeaders,
} from "axios";
import { templateAuthApi } from "../api/template-auth";
import { Customer } from "@/types/template/auth";
const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/v1`;

const AUTH_USER_KEY = "auth_user";


type User = Pick<Customer, "id" | "name" | "email" | "phone"> & {
  accessToken: string;
  refreshToken: string;
};



let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as User;
    return user.accessToken || null;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

const newAccessToken = async () => {
  try {
    const currentUser = localStorage.getItem(AUTH_USER_KEY);

    if (!currentUser) {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }

    const user = JSON.parse(currentUser) as User;

    if (!user.refreshToken) {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }

    const response = await templateAuthApi.refreshAuth({
      refreshToken: user.refreshToken,
    });

    const updatedUser: User = {
      ...user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

    return response.accessToken;
  } catch (error) {
    console.error("Refresh token failed:", getWebErrorMessage(error));

    localStorage.removeItem(AUTH_USER_KEY);

    return null;
  }
};

const logoutUser = () => {
  if (typeof window === "undefined") return null;
  localStorage.removeItem(AUTH_USER_KEY);
};

const webApi = axios.create({
  baseURL,
});

export const webPublicApi = axios.create({
  baseURL,
});


webPublicApi.interceptors.request.use((config) => {
  const host = typeof window !== "undefined" ? window.location.host : "";

  const headers = AxiosHeaders.from(config.headers);

  headers.set("x-forwarded-host", host);

  config.headers = headers;

  return config;
});


webApi.interceptors.request.use((config) => {
  const host = typeof window !== "undefined" ? window.location.host : "";

  const headers = AxiosHeaders.from(config.headers);

  headers.set("x-forwarded-host", host);

  const accessToken = getStoredAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  config.headers = headers;

  return config;
});


webApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // console.log('error',error.response?.status)

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

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(webApi(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await newAccessToken();

      if (!newToken) throw new Error("Refresh failed");

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return webApi(originalRequest);
    } catch (err) {
      processQueue(err, null);
      logoutUser()
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export const getWebErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    console.log("api message", data);

    return data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

export default webApi;