import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { websiteApi } from "../website";
import { WebsiteDomainFormValues, WebsiteTemplatePayload } from "@/types/website/website";

export function useWebsiteQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.website.list(businessId, query),
    queryFn: () => websiteApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useWebsiteTemplates(businessId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.website.templates(businessId),
    queryFn: () => websiteApi.templates(businessId),
    enabled: Boolean(businessId),
  });
}

export function useWebsite(businessId: ApiId, websiteId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.website.detail(businessId, websiteId),

    queryFn: () => {
      if (!businessId || !websiteId) {
        throw new Error("Business ID and Category ID are required");
      }

      return websiteApi.get(businessId, websiteId);
    },

    enabled: Boolean(businessId && websiteId),
  });
}

export function useWebsiteMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.website.all(businessId),
    });

  return {
    createWebsite: useMutation({
      mutationFn: (payload: WebsiteTemplatePayload) =>
        websiteApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    addDomain: useMutation({
      mutationFn: ({
        websiteId,
        payload
      }: {
        websiteId: ApiId;
        payload: WebsiteDomainFormValues;
      }) =>
        websiteApi.addDomain(businessId, websiteId, payload),
      onSuccess: invalidate,
    }),

    updateWebsite: useMutation({
      mutationFn: ({
        websiteId,
        payload,
      }: {
        websiteId: ApiId;
        payload: WebsiteTemplatePayload;
      }) => websiteApi.update(businessId, websiteId, payload),
      onSuccess: invalidate,
    }),

    updatePublish: useMutation({
      mutationFn: (websiteId: ApiId) => websiteApi.updatePublish(businessId, websiteId),
      onSuccess: invalidate,
    }),

    updateUnPublish: useMutation({
      mutationFn: (websiteId: ApiId) => websiteApi.updateUnPublish(businessId, websiteId),
      onSuccess: invalidate,
    }),

    removeWebsite: useMutation({
      mutationFn: (brandId: ApiId) =>
        websiteApi.remove(businessId, brandId),
      onSuccess: invalidate,
    }),

  };
}
