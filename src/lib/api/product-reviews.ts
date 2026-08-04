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

export type ReviewImage = {
  id: string;
  businessId: string;
  reviewId: string;
  imageUrl: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ReviewProduct = {
  id: string;
  businessId: string;
  categoryId: string;
  brandId: string | null;
  unitId: string | null;
  taxId: string | null;

  name: string;
  slug: string;
  description: string | null;

  sku: string;
  barcode: string | null;

  price: string;
  offerPrice: string | null;
  weight: string | null;

  inOffer: boolean;
  startingFrom: string | null;
  endsIn: string | null;

  status: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
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
  images: ReviewImage[];
  product: ReviewProduct;
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
