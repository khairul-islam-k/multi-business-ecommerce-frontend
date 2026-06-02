import { ProductPayload, ProductQuery, ResponseProduct } from "@/types/product/product";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/products`;
export const productApi = {
  list(businessId: ApiId, query?: ProductQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseProduct>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, productId: ApiId) {
    return api
      .get<ApiResponse<ResponseProduct>>(`${basePath(businessId)}/${productId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: ProductPayload) {
    return api
      .post<ApiResponse<ResponseProduct>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    productId: ApiId,
    payload: ProductPayload,
  ) {
    return api
      .patch<ApiResponse<ResponseProduct>>(
        `${basePath(businessId)}/${productId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, productId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${productId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};