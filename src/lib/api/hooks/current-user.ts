"use client";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth";
import { apiQueryKeys } from "@/lib/api/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: apiQueryKeys.auth.me,
    queryFn: authApi.me,
  });
}
