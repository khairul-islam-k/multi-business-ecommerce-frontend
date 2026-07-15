import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { publicWebsiteApi } from "../public-website";
import { ProductQuery } from "@/types/template/template-product";

export function useProductWebReview(productSlug: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.productReview.reviews(productSlug, query),
    queryFn: () => publicWebsiteApi.reviews(productSlug, query),
    enabled: Boolean(productSlug),
  });
}

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

export function useTemplateProduct(slug: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.publicWebsite.detail(slug),

    queryFn: () => {
      if (!slug) {
        throw new Error("Business ID and Category ID are required");
      }

      return publicWebsiteApi.product(slug);
    },

    enabled: Boolean(slug),
  });
}
