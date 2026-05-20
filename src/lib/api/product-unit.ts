import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { BrandPayload, ResponseBrand } from "@/types/product/brands";
import { ResponseUnit, UnitPayload } from "@/types/product/unit";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/units`;
export const productUnitApi = {
//   list(businessId: ApiId, query?: CategoriesQuery) {
//     return api
//       .get<ApiPaginatedResponse<ResponseBrand>>(
//         `${basePath(businessId)}${buildQueryString(query)}`,
//       )
//       .then((res) => normalizePaginatedResponse(res.data));
//   },

//   get(businessId: ApiId, brandId: ApiId) {
//     return api
//       .get<ApiResponse<ResponseBrand>>(`${basePath(businessId)}/${brandId}`)
//       .then((res) => unwrapApiResponse(res.data));
//   },

  create(businessId: ApiId, payload: UnitPayload) {
    return api
      .post<ApiResponse<ResponseUnit>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
//   update(
//     businessId: ApiId,
//     brandId: ApiId,
//     payload: BrandPayload,
//   ) {
//     return api
//       .patch<ApiResponse<ResponseBrand>>(
//         `${basePath(businessId)}/${brandId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   remove(businessId: ApiId, brandId: ApiId) {
//     return api
//       .delete<ApiResponse<null>>(`${basePath(businessId)}/${brandId}`)
//       .then((res) => ({
//         message: res.data.message ?? "Employee deleted successfully",
//       }));
//   },

};