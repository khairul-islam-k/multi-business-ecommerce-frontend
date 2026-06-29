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
} from "@/lib/api/types";
import type {
  PaymentGatewayConfig,
  PaymentGatewayConfigPayload,
  PaymentGatewayConfigQuery,
  PaymentGatewayDefinition,
  PaymentGatewayQuery,
  UpdatePaymentGatewayConfigPayload,
} from "@/types/payment-gateway";

const basePath = (businessId: ApiId) =>
  `/payment-gateways/businesses/${businessId}`;

export const paymentGatewayApi = {
  gateways(businessId: ApiId, query?: PaymentGatewayQuery) {
    return api
      .get<ApiPaginatedResponse<PaymentGatewayDefinition>>(
        `${basePath(businessId)}/gateways${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  configs(businessId: ApiId, query?: PaymentGatewayConfigQuery) {
    return api
      .get<ApiPaginatedResponse<PaymentGatewayConfig>>(
        `${basePath(businessId)}/configs${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  createConfig(businessId: ApiId, payload: PaymentGatewayConfigPayload) {
    return api
      .post<ApiResponse<PaymentGatewayConfig>>(
        `${basePath(businessId)}/configs`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updateConfig(
    businessId: ApiId,
    configId: ApiId,
    payload: UpdatePaymentGatewayConfigPayload,
  ) {
    return api
      .patch<ApiResponse<PaymentGatewayConfig>>(
        `${basePath(businessId)}/configs/${configId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  removeConfig(businessId: ApiId, configId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/configs/${configId}`)
      .then((res) => ({
        message: res.data.message ?? "Payment gateway configuration deleted.",
      }));
  },
};
