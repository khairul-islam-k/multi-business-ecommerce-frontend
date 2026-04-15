import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/onecomm/api/v1",
});

let activeRequests = 0;

const startLoading = () => {
  activeRequests++;
};

const stopLoading = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
  }
};

// Attach token + start loading
api.interceptors.request.use((config) => {
  startLoading();

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle response
api.interceptors.response.use(
  (res) => {
    stopLoading();
    return res;
  },
  async (error) => {
    stopLoading();

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          "http://localhost:5002/onecomm/api/v1/auth/refresh",
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/admin/sign-in";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
