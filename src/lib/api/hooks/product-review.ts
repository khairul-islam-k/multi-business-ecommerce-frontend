"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productReviewsApi } from "../product-reviews";
import { apiQueryKeys } from "../query-keys";
import type { ApiId } from "../types";
import type {
  ProductReviewPayload,
  ProductReviewQuery,
  UpdateProductReviewStatusPayload,
} from "../product-reviews";

export function useProductReviewsQuery(
  businessId: ApiId,
  query?: ProductReviewQuery,
) {
  return useQuery({
    queryKey: apiQueryKeys.ProductReviews.list(businessId, query),
    queryFn: () => productReviewsApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useProductReviewMutations(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductReviews.all(businessId),
    });

  return {
    createReview: useMutation({
      mutationFn: (payload: ProductReviewPayload) =>
        productReviewsApi.create(businessId, payload),
      onSuccess: invalidate,
    }),
    updateReviewStatus: useMutation({
      mutationFn: ({
        reviewId,
        payload,
      }: {
        reviewId: ApiId;
        payload: UpdateProductReviewStatusPayload;
      }) => productReviewsApi.updateStatus(businessId, reviewId, payload),
      onSuccess: invalidate,
    }),
    removeReview: useMutation({
      mutationFn: (reviewId: ApiId) =>
        productReviewsApi.remove(businessId, reviewId),
      onSuccess: invalidate,
    }),
  };
}
