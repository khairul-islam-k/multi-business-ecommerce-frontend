
import { unwrapApiResponse } from "@/lib/api/response";
import type {
  ApiResponse
} from "@/lib/api/types";
import webApi from "../public-api-hook/web-api";
import { CustomerAuthRegistrationResponse, CustomerRegisterPayload, LoginCustomerResponse, LoginPayload, otpPayload } from "@/types/template/auth";

export const templateAuthApi = {
  register(payload: CustomerRegisterPayload) {
    return webApi
      .post<ApiResponse<CustomerAuthRegistrationResponse>>("/storefront/auth/register", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  otpVerify(payload: otpPayload) {
    return webApi
      .post<ApiResponse<unknown>>("/storefront/auth/verify-email", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  login(payload: LoginPayload) {
    return webApi
      .post<ApiResponse<LoginCustomerResponse>>("/storefront/auth/login", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  sendOtp(email: string) {
    return webApi
      .post<ApiResponse<unknown>>("/storefront/auth/request-verification", {email})
      .then((res) => unwrapApiResponse(res.data));
  },

  forgetOtpSend(email: string) {
    return webApi
      .post<ApiResponse<unknown>>("/storefront/auth/forgot-password", {email})
      .then((res) => unwrapApiResponse(res.data));
  },

//   refresh(payload: RefreshPayload) {
//     return publicApi
//       .post<ApiResponse<AuthPayload>>("/auth/refresh", payload)
//       .then((res) => unwrapApiResponse(res.data))
//   },

//   selectBusiness(payload: SelectBusinessPayload) {
//     return api
//       .post<
//         ApiResponse<Omit<AuthPayload, "refreshToken" | "businesses">>
//       >("/auth/select-business", payload)
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   me() {
//     return api
//       .get<
//         ApiResponse<Pick<AuthPayload, "user" | "selectedBusiness" | "businesses">>
//       >("/auth/me")
//       .then((res) => unwrapApiResponse(res.data));
//   },

//   logout(payload: LogoutPayload) {
//     return api
//       .post<ApiResponse<null>>("/auth/logout", payload)
//       .then((res) => ({
//         message: res.data.message ?? "Logged out successfully",
//       }));
//   },

//   logoutAll() {
//     return api
//       .post<ApiResponse<null>>("/auth/logout-all")
//       .then((res) => ({
//         message: res.data.message ?? "Logged out from all devices successfully",
//       }));
//   },
};
