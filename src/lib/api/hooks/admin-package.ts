"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminPackagesApi } from "@/lib/api/admin-packages";
import { apiQueryKeys } from "@/lib/api/query-keys";
import type {
  ApiId,
  CancelPackageSubscriptionPayload,
  ChangeTenantSubscriptionPlanPayload,
  CreateTenantSubscriptionPayload,
  PackagePlanPayload,
  PackageQuery,
  TenantSubscriptionQuery,
} from "@/lib/api/types";

export function usePackagePlans(query?: PackageQuery) {
  return useQuery({
    queryKey: apiQueryKeys.adminPackages.plans(query),
    queryFn: () => adminPackagesApi.listPlans(query),
  });
}

export function useTenantSubscriptions(query?: TenantSubscriptionQuery) {
  return useQuery({
    queryKey: apiQueryKeys.adminPackages.subscriptions(query),
    queryFn: () => adminPackagesApi.listSubscriptions(query),
  });
}

export function useAdminPackageMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.adminPackages.all,
    });

  return {
    createPlan: useMutation({
      mutationFn: (payload: PackagePlanPayload) =>
        adminPackagesApi.createPlan(payload),
      onSuccess: invalidate,
    }),
    updatePlan: useMutation({
      mutationFn: ({
        planId,
        payload,
      }: {
        planId: ApiId;
        payload: Partial<PackagePlanPayload>;
      }) => adminPackagesApi.updatePlan(planId, payload),
      onSuccess: invalidate,
    }),
    deletePlan: useMutation({
      mutationFn: adminPackagesApi.deletePlan,
      onSuccess: invalidate,
    }),
    createSubscription: useMutation({
      mutationFn: (payload: CreateTenantSubscriptionPayload) =>
        adminPackagesApi.createSubscription(payload),
      onSuccess: invalidate,
    }),
    changeSubscriptionPlan: useMutation({
      mutationFn: ({
        subscriptionId,
        payload,
      }: {
        subscriptionId: ApiId;
        payload: ChangeTenantSubscriptionPlanPayload;
      }) => adminPackagesApi.changeSubscriptionPlan(subscriptionId, payload),
      onSuccess: invalidate,
    }),
    cancelSubscription: useMutation({
      mutationFn: ({
        subscriptionId,
        payload,
      }: {
        subscriptionId: ApiId;
        payload: CancelPackageSubscriptionPayload;
      }) => adminPackagesApi.cancelSubscription(subscriptionId, payload),
      onSuccess: invalidate,
    }),
  };
}
