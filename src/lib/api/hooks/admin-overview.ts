import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { overviewQuery } from "@/types/dashboard-overview/tenant";
import { superAdminOverviewApi } from "../admin-overview";

export function useAdminOverviewQuery(query?: overviewQuery) {
  return useQuery({
    queryKey: apiQueryKeys.adminOverview.detail(query),
    queryFn: () => superAdminOverviewApi.get(query),
  });
}