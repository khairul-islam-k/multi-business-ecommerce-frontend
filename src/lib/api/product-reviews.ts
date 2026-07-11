import api from "../axios";
import { buildQueryString } from "./params";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  ListQuery,
} from "./types";

export type ProductReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ProductReviewPayload = {
  productId: ApiId;
  variantId?: ApiId;
  rating: number;
  title?: string;
  comment?: string;
  reviewerName: string;
  reviewerEmail?: string;
  reviewerPhone?: string;
};

export type ProductReviewQuery = ListQuery & {
  productId?: ApiId;
  variantId?: ApiId;
  status?: ProductReviewStatus;
};

export type UpdateProductReviewStatusPayload = {
  status: ProductReviewStatus;
};

export type ProductReviewResponse = {
  id: ApiId;
  businessId: ApiId;
  productId: ApiId;
  variantId?: ApiId | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  reviewerName: string;
  reviewerEmail?: string | null;
  reviewerPhone?: string | null;
  status: ProductReviewStatus;
  product?: unknown;
  variant?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

const basePath = (businessId: ApiId) =>
  `/product-catalog/businesses/${businessId}/reviews`;

export const productReviewsApi = {
  list(businessId: ApiId, query?: ProductReviewQuery) {
    return api
      .get<ApiPaginatedResponse<ProductReviewResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(businessId: ApiId, payload: ProductReviewPayload) {
    return api
      .post<ApiResponse<ProductReviewResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateStatus(
    businessId: ApiId,
    reviewId: ApiId,
    payload: UpdateProductReviewStatusPayload,
  ) {
    return api
      .patch<ApiResponse<ProductReviewResponse>>(
        `${basePath(businessId)}/${reviewId}/status`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, reviewId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${reviewId}`)
      .then((res) => ({
        message: res.data.message ?? "Product review deleted successfully",
      }));
  },
};
