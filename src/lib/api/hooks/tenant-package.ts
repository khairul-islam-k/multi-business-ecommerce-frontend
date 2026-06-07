"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { tenantPackagesApi } from "@/lib/api/tenant-packages";
import type {
  ApiId,
  CancelPackageSubscriptionPayload,
  CheckoutPackageAddonPayload,
  PackageQuery,
} from "@/lib/api/types";

export function useTenantPackagePlans(query?: PackageQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenantPackages.plans(query),
    queryFn: () => tenantPackagesApi.listPlans(query),
  });
}

export function useTenantPackageAddons(query?: PackageQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenantPackages.addons(query),
    queryFn: () => tenantPackagesApi.listAddons(query),
  });
}

export function useTenantCurrentSubscription() {
  return useQuery({
    queryKey: apiQueryKeys.tenantPackages.current,
    queryFn: tenantPackagesApi.currentSubscription,
    retry: false,
  });
}

export function useTenantSubscriptionHistory(query?: PackageQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenantPackages.history(query),
    queryFn: () => tenantPackagesApi.subscriptionHistory(query),
  });
}

export function useTenantPackageUsage() {
  return useQuery({
    queryKey: apiQueryKeys.tenantPackages.usage,
    queryFn: tenantPackagesApi.usage,
    retry: false,
  });
}

export function useTenantPackageMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.tenantPackages.all,
    });

  return {
    checkoutPlan: useMutation({
      mutationFn: tenantPackagesApi.checkoutPlan,
      onSuccess: invalidate,
    }),
    checkoutAddon: useMutation({
      mutationFn: ({
        addonId,
        payload,
      }: {
        addonId: ApiId;
        payload: CheckoutPackageAddonPayload;
      }) => tenantPackagesApi.checkoutAddon(addonId, payload),
      onSuccess: invalidate,
    }),
    confirmMockPayment: useMutation({
      mutationFn: tenantPackagesApi.confirmMockPayment,
      onSuccess: invalidate,
    }),
    removeAddon: useMutation({
      mutationFn: tenantPackagesApi.removeAddon,
      onSuccess: invalidate,
    }),
  };
}
