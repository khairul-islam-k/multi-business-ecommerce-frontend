import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import {
  ProductTagPayload,
  ResponseProductTag,
} from "@/types/product/product";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/tags`;
export const productTagApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseProductTag>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, tagId: ApiId) {
    return api
      .get<ApiResponse<ResponseProductTag>>(`${basePath(businessId)}/${tagId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: ProductTagPayload) {
    return api
      .post<ApiResponse<ResponseProductTag>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    tagId: ApiId,
    payload: ProductTagPayload,
  ) {
    return api
      .patch<ApiResponse<ResponseProductTag>>(
        `${basePath(businessId)}/${tagId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, tagId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${tagId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};
