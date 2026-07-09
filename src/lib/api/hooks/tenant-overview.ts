import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { tenantOverviewApi } from "../tenant-overview";
import { overviewQuery } from "@/types/dashboard-overview/tenant";

export function useTenantOverviewQuery(businessId: ApiId, query?: overviewQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenantOverview.detail(businessId, query),
    queryFn: () => tenantOverviewApi.get(businessId, query),
    enabled: Boolean(businessId),
  });
}