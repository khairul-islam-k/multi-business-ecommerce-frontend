import { ProductCategoryPayload, ResponseCategory } from "@/types/product/product";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/categories`;
export const productCategoriesApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseCategory>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, CategoryId: ApiId) {
    return api
      .get<ApiResponse<ResponseCategory>>(`${basePath(businessId)}/${CategoryId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: ProductCategoryPayload) {
    return api
      .post<ApiResponse<ResponseCategory>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    CategoryId: ApiId,
    payload: ProductCategoryPayload,
  ) {
    return api
      .patch<ApiResponse<ResponseCategory>>(
        `${basePath(businessId)}/${CategoryId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, CategoryId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${CategoryId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};