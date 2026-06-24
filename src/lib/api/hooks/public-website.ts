import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { BrandPayload } from "@/types/product/brands";
import { publicWebsiteApi } from "../public-website";
import { ProductQuery } from "@/types/template/template-product";

export function useProductCategoryQuery( query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.publicWebsite.list(query),
    queryFn: () => publicWebsiteApi.categories(),
  });
}

export function useProductTagsQuery( query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.publicWebsite.listTag(query),
    queryFn: () => publicWebsiteApi.tags(),
  });
}

export function useTemplateProductQuery(query?: ProductQuery) {
  return useQuery({
    queryKey: apiQueryKeys.publicWebsite.listProducts(query),
    queryFn: () => publicWebsiteApi.products(query),
  });
}

// export function useBrand(businessId: ApiId, brandId: ApiId) {
//   return useQuery({
//     queryKey: apiQueryKeys.ProductCategories.detail(businessId, brandId),

//     queryFn: () => {
//       if (!businessId || !brandId) {
//         throw new Error("Business ID and Category ID are required");
//       }

//       return productBrandApi.get(businessId, brandId);
//     },

//     enabled: Boolean(businessId && brandId),
//   });
// }

// export function useBrandMutation(businessId: ApiId) {
//   const queryClient = useQueryClient();

//   const invalidate = () =>
//     queryClient.invalidateQueries({
//       queryKey: apiQueryKeys.ProductBrands.all(businessId),
//     });

//   return {
//     createBrand: useMutation({
//       mutationFn: (payload: BrandPayload) =>
//         productBrandApi.create(businessId, payload),
//       onSuccess: invalidate,
//     }),

//     updateBrand: useMutation({
//       mutationFn: ({
//         brandId,
//         payload,
//       }: {
//         brandId: ApiId;
//         payload: BrandPayload;
//       }) => productBrandApi.update(businessId, brandId, payload),
//       onSuccess: invalidate,
//     }),

//     removeBrand: useMutation({
//       mutationFn: (brandId: ApiId) =>
//         productBrandApi.remove(businessId, brandId),
//       onSuccess: invalidate,
//     }),

//   };
// }