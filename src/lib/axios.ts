import axios, { AxiosError } from "axios";

import { store } from "@/store";
import { setCredentials, logout } from "@/store/auth-slice";

const api = axios.create({
  baseURL: "http://localhost:5002/onecomm/api/v1",
});

// Attach token
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          "http://localhost:5002/onecomm/api/v1/auth/refresh",
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        store.dispatch(setCredentials({ accessToken }));

        localStorage.setItem("refreshToken", newRefresh);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        store.dispatch(logout());
        localStorage.removeItem("refreshToken");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown) => {
  const err = error as AxiosError<any>;

  const status = err.response?.status;

  switch (status) {
    case 400:
      return "Invalid request.";
    case 401:
      return "Invalid credentials.";
    case 403:
      return "You are not allowed to do this.";
    case 500:
      return "Server error. Try again later.";
    default:
      return "Couldn't sign in. Try again later.";
  }
};

export default api;
