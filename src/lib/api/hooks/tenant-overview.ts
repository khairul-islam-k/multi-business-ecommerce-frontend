import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { tenantOverviewApi } from "../tenant-overview";

export function useTenantOverviewQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenantOverview.detail(businessId, query),
    queryFn: () => tenantOverviewApi.get(businessId, query),
    enabled: Boolean(businessId),
  });
}