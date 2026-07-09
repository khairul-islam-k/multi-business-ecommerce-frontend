import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { CreateProductReviewPayload } from "@/types/template/product-review";
import { ProductReviewResponse } from "./product-reviews";

const basePath = () => `/storefront/customer/products/reviews`;
export const templateProductReview = {
  list(query?: CategoriesQuery) {
    return webApi
      .get<ApiPaginatedResponse<ProductReviewResponse>>(
        `/storefront/customer/reviews${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  // get(businessId: ApiId, brandId: ApiId) {
  //   return webApi
  //     .get<ApiResponse<ResponseBrand>>(`${basePath(businessId)}/${brandId}`)
  //     .then((res) => unwrapApiResponse(res.data));
  // },

  create(payload: CreateProductReviewPayload) {
    return webApi
      .post<ApiResponse<unknown>>(basePath(), payload)
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