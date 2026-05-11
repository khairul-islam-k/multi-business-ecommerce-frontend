"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth.store";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import type { PermissionRequirement } from "@/lib/auth/permissions";
import { isPrivilegedDashboardUser } from "@/lib/auth/permissions";
import { permissionsApi } from "@/lib/api";

function getErrorStatus(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.status ?? null;
  return null;
}

export function usePermissionAccess(permission?: PermissionRequirement | null) {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const businessId = useActiveBusinessId();
  const userType = user?.type;

  const shouldProbe = Boolean(
    initialized && userType === "EMPLOYEE" && businessId && permission,
  );

  const probeQuery = useQuery({
    queryKey: [
      "auth",
      "permission-probe",
      businessId,
      permission?.feature,
      permission?.action,
    ],
    queryFn: () =>
      permissionsApi.has(
        businessId as number,
        permission as PermissionRequirement,
      ),
    enabled: shouldProbe,
    retry: false,
    staleTime: 60_000,
  });

  if (!permission) {
    return {
      allowed: true,
      denied: false,
      loading: false,
      status: null,
    };
  }

  if (!initialized) {
    return {
      allowed: false,
      denied: false,
      loading: true,
      status: null,
    };
  }

  if (isPrivilegedDashboardUser(userType)) {
    return {
      allowed: true,
      denied: false,
      loading: false,
      status: null,
    };
  }

  if (userType !== "EMPLOYEE" || !businessId) {
    return {
      allowed: false,
      denied: true,
      loading: false,
      status: null,
    };
  }

  const status = getErrorStatus(probeQuery.error);
  const denied = probeQuery.isError && status === 403;

  return {
    allowed: probeQuery.data,
    denied: denied || (probeQuery.isError && status !== 401),
    loading: probeQuery.isLoading || probeQuery.isFetching,
    status,
  };
}
