import axios, { AxiosHeaders } from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL!}/api/v1`;

const webApi = axios.create({
  baseURL,
});

webApi.interceptors.request.use((config) => {
      const host = typeof window !== "undefined" ? window.location.host : "";

      const headers = AxiosHeaders.from(config.headers);

      // Browser cannot set real `host` header manually.
      // So send custom header instead.
      headers.set("x-forwarded-host", host);

      config.headers = headers;

      return config;
    });


export default webApi;