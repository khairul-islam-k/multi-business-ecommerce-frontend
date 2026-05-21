import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { ResponseUnit, UnitPayload } from "@/types/product/unit";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/tags`;
export const productTagApi = {
//   list(businessId: ApiId, query?: CategoriesQuery) {
//     return api
//       .get<ApiPaginatedResponse<ResponseUnit>>(
//         `${basePath(businessId)}${buildQueryString(query)}`,
//       )
//       .then((res) => normalizePaginatedResponse(res.data));
//   },

//   get(businessId: ApiId, unitId: ApiId) {
//     return api
//       .get<ApiResponse<ResponseUnit>>(`${basePath(businessId)}/${unitId}`)
//       .then((res) => unwrapApiResponse(res.data));
//   },

  create(businessId: ApiId, payload: UnitPayload) {
    return api
      .post<ApiResponse<ResponseUnit>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

//   update(
//     businessId: ApiId,
//     unitId: ApiId,
//     payload: UnitPayload,
//   ) {
//     return api
//       .patch<ApiResponse<ResponseUnit>>(
//         `${basePath(businessId)}/${unitId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   remove(businessId: ApiId, unitId: ApiId) {
//     return api
//       .delete<ApiResponse<null>>(`${basePath(businessId)}/${unitId}`)
//       .then((res) => ({
//         message: res.data.message ?? "Employee deleted successfully",
//       }));
//   },

};