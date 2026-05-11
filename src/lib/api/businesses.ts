import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import {
  normalizePaginatedResponse,
  unwrapApiResponse,
} from "@/lib/api/response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  Business,
  BusinessPayload,
  BusinessQuery,
} from "@/lib/api/types";

export const businessesApi = {
  list(query?: BusinessQuery) {
    return api
      .get<ApiPaginatedResponse<Business>>(
        `/businesses${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(payload: BusinessPayload) {
    return api
      .post<ApiResponse<Business>>("/businesses", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  get(businessId: ApiId) {
    return api
      .get<ApiResponse<Business>>(`/businesses/${businessId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(businessId: ApiId, payload: Partial<BusinessPayload>) {
    return api
      .patch<ApiResponse<Business>>(`/businesses/${businessId}`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`/businesses/${businessId}`)
      .then((res) => ({
        message: res.data.message ?? "Business deleted successfully",
      }));
  },
};
