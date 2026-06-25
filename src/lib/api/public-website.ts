import api, { getApiErrorMessage, publicApi } from "@/lib/axios";
import { normalizePaginatedResponse, unwrapApiResponse, unwrapArrayResponse } from "@/lib/api/response";
import type {
  ApiArrayResponse,
  ApiPaginatedResponse,
  ApiResponse,
  AuthPayload,
  CategoriesQuery,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
  RegisterPayload,
  RegisterResponse,
  SelectBusinessPayload,
} from "@/lib/api/types";
import webApi from "../public-api-hook/web-api";
import { ProductTagResponse, StorefrontCategoryTreeItem } from "@/types/template/public-website";
import { buildQueryString } from "./params";
import { ProductQuery, StorefrontProduct } from "@/types/template/template-product";

const basePath = () => `/storefront`;

export const publicWebsiteApi = {
  resolve() {
    return publicApi
      .get<ApiResponse<RegisterResponse>>("/storefront/resolve")
      .then((res) => unwrapApiResponse(res.data));
  },

  categories() {
    return webApi
      .get<ApiArrayResponse<StorefrontCategoryTreeItem>>(`${basePath()}/categories`)
      .then((res) => unwrapArrayResponse(res.data));
  },

  tags() {
    return webApi
      .get<ApiArrayResponse<ProductTagResponse>>(`${basePath()}/tags`)
      .then((res) => unwrapArrayResponse(res.data));
  },

  products(query?: ProductQuery) {
    return webApi
      .get<ApiPaginatedResponse<StorefrontProduct>>(
        `${basePath()}/products${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  product(slug: string) {
    return webApi
      .get<ApiResponse<StorefrontProduct>>(
        `${basePath()}/products/${slug}`,
      )
      .then((res) => unwrapApiResponse(res.data));
  }
  
};
