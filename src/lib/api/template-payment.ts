import { normalizePaginatedResponse, unwrapApiResponse, unwrapArrayResponse } from "./response";
import { ApiArrayResponse, ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { OrderResponse, PaymentInitPayload, PaymentPayload, TemplatePaymentGatewayResponse, VerifyPaymentResponse } from "@/types/template/template-payment";
import { PaymentGatewayProvider, PaymentQuery } from "@/types/payment-gateway";

const basePath = () => `/storefront/customer/orders/place`;
export const templatePaymentApi = {
  list() {
    return webApi
      .get<ApiArrayResponse<TemplatePaymentGatewayResponse>>(
        `/storefront/payment-gateways`,
      )
      .then((res) => unwrapArrayResponse(res.data));
  },

//   get(businessId: ApiId, brandId: ApiId) {
//     return api
//       .get<ApiResponse<ResponseBrand>>(`${basePath(businessId)}/${brandId}`)
//       .then((res) => unwrapApiResponse(res.data));
//   },

  create(payload: PaymentPayload) {
    return webApi
      .post<ApiResponse<OrderResponse>>(basePath(), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  createProvidePayment(orderId: ApiId ,payload: PaymentInitPayload) {
    return webApi
      .post<ApiResponse<unknown>>(`/storefront/customer/orders/${orderId}/payments/initiate`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  verifyPayment(provider: PaymentGatewayProvider, paymentId: ApiId ,eventType: ApiId, query?: PaymentQuery) {
    return webApi
      .post<ApiResponse<VerifyPaymentResponse>>(`/payment-gateways/callbacks/${provider}/${paymentId}/${eventType}${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },
//   update(
//     businessId: ApiId,
//     brandId: ApiId,
//     payload: BrandPayload,
//   ) {
//     return api
//       .patch<ApiResponse<ResponseBrand>>(
//         `${basePath(businessId)}/${brandId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   remove(businessId: ApiId, brandId: ApiId) {
//     return api
//       .delete<ApiResponse<null>>(`${basePath(businessId)}/${brandId}`)
//       .then((res) => ({
//         message: res.data.message ?? "Employee deleted successfully",
//       }));
//   },

};