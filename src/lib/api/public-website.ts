import api, { getApiErrorMessage, publicApi } from "@/lib/axios";
import { unwrapApiResponse, unwrapArrayResponse } from "@/lib/api/response";
import type {
  ApiArrayResponse,
  ApiResponse,
  AuthPayload,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
  RegisterPayload,
  RegisterResponse,
  SelectBusinessPayload,
} from "@/lib/api/types";
import webApi from "../public-api-hook/web-api";
import { StorefrontCategoryTreeItem } from "@/types/template/public-website";

const basePath = () => `/storefront`;

export const publicWebsiteApi = {
  resolve() {
    return publicApi
      .get<ApiResponse<RegisterResponse>>("/storefront/resolve")
      .then((res) => unwrapApiResponse(res.data));
  },

  categories() {
    return webApi
      .get<ApiArrayResponse<StorefrontCategoryTreeItem>>(`${basePath()}/categories`)
      .then((res) => unwrapArrayResponse(res.data));
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
