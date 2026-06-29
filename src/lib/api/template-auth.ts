
import { unwrapApiResponse } from "@/lib/api/response";
import type {
  ApiResponse
} from "@/lib/api/types";
import webApi from "../public-api-hook/web-api";
import { CustomerAuthRegistrationResponse, CustomerRegisterPayload, ForgetOtpResponse, LoginCustomerResponse, LoginPayload, otpPayload, RefreshTokenPayload, ResetPasswordPayload } from "@/types/template/auth";
import { publicApi } from "../axios";

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

  forgetOtpVerify(payload: otpPayload) {
    return webApi
      .post<ApiResponse<ForgetOtpResponse>>("/storefront/auth/verify-reset", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  forgetResentPassword(payload: ResetPasswordPayload) {
    return webApi
      .post<ApiResponse<null>>("/storefront/auth/reset-password", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  refreshAuth(payload: RefreshTokenPayload) {
    return webApi
      .post<ApiResponse<LoginCustomerResponse>>("/storefront/auth/refresh", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  logOut(payload: RefreshTokenPayload) {
    return publicApi
      .post<ApiResponse<null>>("/storefront/auth/logout", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  userProfile() {
    return webApi
      .get<ApiResponse<CustomerAuthRegistrationResponse>>("/storefront/auth/me")
      .then((res) => unwrapApiResponse(res.data));
  },

};
