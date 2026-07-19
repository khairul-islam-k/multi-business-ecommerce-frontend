import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { contactPayload, CreateProductReviewPayload } from "@/types/template/product-review";
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

  create(payload: CreateProductReviewPayload) {
    return webApi
      .post<ApiResponse<unknown>>(basePath(), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  contact(payload: contactPayload) {
    return webApi
      .post<ApiResponse<unknown>>('/storefront/contact', payload)
      .then((res) => unwrapApiResponse(res.data));
  },


};