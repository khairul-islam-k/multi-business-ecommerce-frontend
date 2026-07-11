import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { PurchaseReturnResponse } from "@/types/suppliers/return";

const basePath = (businessId: ApiId) => `/suppliers/businesses/${businessId}/purchase-returns`;
export const productPurchaseReturnApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<PurchaseReturnResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, returnId: ApiId) {
    return api
      .get<ApiResponse<PurchaseReturnResponse>>(`${basePath(businessId)}/${returnId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateReturnComplete(
    businessId: ApiId,
    returnId: ApiId
  ) {
    return api
      .patch<ApiResponse<unknown>>(
        `${basePath(businessId)}/${returnId}/complete`
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updateReturnCancel(
    businessId: ApiId,
    returnId: ApiId
  ) {
    return api
      .patch<ApiResponse<unknown>>(
        `${basePath(businessId)}/${returnId}/cancel`
      )
      .then((res) => unwrapApiResponse(res.data));
  }

};