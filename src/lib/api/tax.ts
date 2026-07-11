import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { TaxPayload, TaxResponse } from "@/types/finance/tax";

const basePath = (businessId: ApiId) => `/finance/businesses/${businessId}/taxes`;
export const taxApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<TaxResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, taxId: ApiId) {
    return api
      .get<ApiResponse<TaxResponse>>(`${basePath(businessId)}/${taxId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: TaxPayload) {
    return api
      .post<ApiResponse<TaxResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    taxId: ApiId,
    payload: TaxPayload,
  ) {
    return api
      .patch<ApiResponse<TaxResponse>>(
        `${basePath(businessId)}/${taxId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, taxId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${taxId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};