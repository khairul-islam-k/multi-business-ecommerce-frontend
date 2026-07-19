import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { CategoriesQuery } from "../types";
import { contactPayload, CreateProductReviewPayload } from "@/types/template/product-review";
import { templateProductReview } from "../templater-product-review";
import { templateAuthApi } from "../template-auth";

export function useTemplateProductReviewQuery(query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.productReview.list(query),
    queryFn: () => templateProductReview.list(query),
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: apiQueryKeys.productReview.detailProfile(),

    queryFn: () => {
      return templateAuthApi.userProfile();
    },
  });
}

export function useTemplateProductReviewMutation() {
    const queryClient = useQueryClient();

    const invalidate = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.productReview.all(),
            })
        ]);
    };

    return {
        createReview: useMutation({
            mutationFn: (payload: CreateProductReviewPayload) =>
                templateProductReview.create(payload),
            onSuccess: invalidate,
        }),

        contact: useMutation({
            mutationFn: (payload: contactPayload) =>
                templateProductReview.contact(payload),
            onSuccess: invalidate,
        }),

    };
}