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
  ConfirmPackagePaymentResult,
  PackageMockPayment,
  PackagePlan,
  PackageQuery,
  PackageUsageSummaryItem,
  PaymentRedirectUrls,
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
  checkoutPlan({
    planId, 
    payload
  }: {
    planId: ApiId;
    payload: PaymentRedirectUrls
  }) {
    return api
      .post<ApiResponse<PackageMockPayment>>(
        `${basePath}/plans/${planId}/checkout`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  confirmMockPayment(paymentId: ApiId) {
    return api
      .post<ApiResponse<ConfirmPackagePaymentResult>>(
        `${basePath}/mock-payments/${paymentId}/confirm`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
};
