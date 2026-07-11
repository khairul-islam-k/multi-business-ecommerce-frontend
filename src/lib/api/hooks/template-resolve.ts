import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { templateAuthApi } from "../template-auth";

export function useResolveWebsite() {
  return useQuery({
    queryKey: apiQueryKeys.templateResolve.detail(),

    queryFn: () => {
      return templateAuthApi.resolveWebsite();
    },
  });
}