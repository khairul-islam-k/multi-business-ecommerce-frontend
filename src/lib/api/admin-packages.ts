import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import {
  normalizePaginatedResponse,
  unwrapApiResponse,
} from "@/lib/api/response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  CancelPackageSubscriptionPayload,
  ChangeTenantSubscriptionPlanPayload,
  CreateTenantSubscriptionPayload,
  PackagePlan,
  PackagePlanPayload,
  PackageQuery,
  TenantSubscription,
  TenantSubscriptionQuery,
} from "@/lib/api/types";

const basePath = "/admin/packages";

export const adminPackagesApi = {
  listPlans(query?: PackageQuery) {
    return api
      .get<
        ApiPaginatedResponse<PackagePlan>
      >(`${basePath}/plans${buildQueryString(query)}`)
      .then((res) => normalizePaginatedResponse(res.data));
  },
  getPlan(planId: ApiId) {
    return api
      .get<ApiResponse<PackagePlan>>(`${basePath}/plans/${planId}`)
      .then((res) => unwrapApiResponse(res.data));
  },
  createPlan(payload: PackagePlanPayload) {
    return api
      .post<ApiResponse<PackagePlan>>(`${basePath}/plans`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  updatePlan(planId: ApiId, payload: Partial<PackagePlanPayload>) {
    return api
      .patch<ApiResponse<PackagePlan>>(`${basePath}/plans/${planId}`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  deletePlan(planId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath}/plans/${planId}`)
      .then((res) => ({
        message: res.data.message ?? "Package plan deleted successfully",
      }));
  },
  listSubscriptions(query?: TenantSubscriptionQuery) {
    return api
      .get<
        ApiPaginatedResponse<TenantSubscription>
      >(`${basePath}/subscriptions${buildQueryString(query)}`)
      .then((res) => normalizePaginatedResponse(res.data));
  },
  getSubscription(subscriptionId: ApiId) {
    return api
      .get<
        ApiResponse<TenantSubscription>
      >(`${basePath}/subscriptions/${subscriptionId}`)
      .then((res) => unwrapApiResponse(res.data));
  },
  createSubscription(payload: CreateTenantSubscriptionPayload) {
    return api
      .post<
        ApiResponse<TenantSubscription>
      >(`${basePath}/subscriptions`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  changeSubscriptionPlan(
    subscriptionId: ApiId,
    payload: ChangeTenantSubscriptionPlanPayload,
  ) {
    return api
      .patch<
        ApiResponse<TenantSubscription>
      >(`${basePath}/subscriptions/${subscriptionId}/plan`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  cancelSubscription(
    subscriptionId: ApiId,
    payload: CancelPackageSubscriptionPayload,
  ) {
    return api
      .patch<
        ApiResponse<TenantSubscription>
      >(`${basePath}/subscriptions/${subscriptionId}/cancel`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
};
