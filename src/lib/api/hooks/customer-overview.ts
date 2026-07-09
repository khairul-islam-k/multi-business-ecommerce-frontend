import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { overviewQuery } from "@/types/dashboard-overview/tenant";
import { customerOverviewApi } from "../customer-overview";

export function useCustomerOverviewQuery(query?: overviewQuery) {
  return useQuery({
    queryKey: apiQueryKeys.customerOverview.detail(query),
    queryFn: () => customerOverviewApi.get(query),
  });
}