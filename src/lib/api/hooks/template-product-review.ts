import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { BrandPayload } from "@/types/product/brands";
import { productBrandApi } from "../product-brand";
import { CreateProductReviewPayload } from "@/types/template/product-review";
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

export function useTemplateProductReviewMutation(slug?: string) {
    const queryClient = useQueryClient();

    const invalidate = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.productReview.all(),
            }),

            slug
                ? queryClient.invalidateQueries({
                    queryKey: apiQueryKeys.publicWebsite.detail(slug),
                })
                : Promise.resolve(),
        ]);
    };

    return {
        createReview: useMutation({
            mutationFn: (payload: CreateProductReviewPayload) =>
                templateProductReview.create(payload),
            onSuccess: invalidate,
        }),

        // updateBrand: useMutation({
        //   mutationFn: ({
        //     brandId,
        //     payload,
        //   }: {
        //     brandId: ApiId;
        //     payload: BrandPayload;
        //   }) => productBrandApi.update(businessId, brandId, payload),
        //   onSuccess: invalidate,
        // }),

        // removeBrand: useMutation({
        //   mutationFn: (brandId: ApiId) =>
        //     productBrandApi.remove(businessId, brandId),
        //   onSuccess: invalidate,
        // }),

    };
}