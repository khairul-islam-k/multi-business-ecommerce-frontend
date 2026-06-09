import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { FinanceAccountPayload } from "@/types/finance/account";

const basePath = (businessId: ApiId) => `http://192.168.0.135:8000/api/v1/finance/businesses/${businessId}/accounts`;
export const financeAccountApi = {
//   list(businessId: ApiId, query?: ProductQuery) {
//     return api
//       .get<ApiPaginatedResponse<ResponseProduct>>(
//         `${basePath(businessId)}${buildQueryString(query)}`,
//       )
//       .then((res) => normalizePaginatedResponse(res.data));
//   },

//   get(businessId: ApiId, productId: ApiId) {
//     return api
//       .get<ApiResponse<ResponseProduct>>(`${basePath(businessId)}/${productId}`)
//       .then((res) => unwrapApiResponse(res.data));
//   },

  create(businessId: ApiId, payload: FinanceAccountPayload) {
    return api
      .post<ApiResponse<unknown>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
//   update(
//     businessId: ApiId,
//     productId: ApiId,
//     payload: ProductPayload,
//   ) {
//     return api
//       .patch<ApiResponse<ResponseProduct>>(
//         `${basePath(businessId)}/${productId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   remove(businessId: ApiId, productId: ApiId) {
//     return api
//       .delete<ApiResponse<null>>(`${basePath(businessId)}/${productId}`)
//       .then((res) => ({
//         message: res.data.message ?? "Employee deleted successfully",
//       }));
//   },

};