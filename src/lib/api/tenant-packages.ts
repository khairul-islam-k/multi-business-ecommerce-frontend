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
  CheckoutPackageAddonPayload,
  ConfirmPackagePaymentResult,
  PackageAddon,
  PackageMockPayment,
  PackagePlan,
  PackageQuery,
  PackageSubscriptionAddon,
  PackageUsageSummaryItem,
  TenantSubscription,
} from "@/lib/api/types";

const basePath = "/tenant/packages";

export const tenantPackagesApi = {
  listPlans(query?: PackageQuery) {
    return api
      .get<ApiPaginatedResponse<PackagePlan>>(
        `${basePath}/plans${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },
  listAddons(query?: PackageQuery) {
    return api
      .get<ApiPaginatedResponse<PackageAddon>>(
        `${basePath}/addons${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },
  currentSubscription() {
    return api
      .get<ApiResponse<TenantSubscription>>(`${basePath}/subscription/current`)
      .then((res) => unwrapApiResponse(res.data));
  },
  subscriptionHistory(query?: PackageQuery) {
    return api
      .get<ApiPaginatedResponse<TenantSubscription>>(
        `${basePath}/subscription/history${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },
  usage() {
    return api
      .get<ApiResponse<PackageUsageSummaryItem[]>>(
        `${basePath}/subscription/usage`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  checkoutPlan(planId: ApiId) {
    return api
      .post<ApiResponse<PackageMockPayment>>(
        `${basePath}/plans/${planId}/checkout`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  checkoutAddon(addonId: ApiId, payload: CheckoutPackageAddonPayload) {
    return api
      .post<ApiResponse<PackageMockPayment>>(
        `${basePath}/addons/${addonId}/checkout`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  confirmMockPayment(paymentId: ApiId) {
    return api
      .post<ApiResponse<ConfirmPackagePaymentResult>>(
        `${basePath}/mock-payments/${paymentId}/confirm`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  removeAddon(subscriptionAddonId: ApiId) {
    return api
      .delete<
        ApiResponse<PackageSubscriptionAddon>
      >(`${basePath}/subscription/addons/${subscriptionAddonId}`)
      .then((res) => unwrapApiResponse(res.data));
  },
};
