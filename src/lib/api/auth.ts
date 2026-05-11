import api, { publicApi } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/api/response";
import type {
  ApiResponse,
  AuthPayload,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
  RegisterPayload,
  RegisterResponse,
  SelectBusinessPayload,
} from "@/lib/api/types";

export const authApi = {
  register(payload: RegisterPayload) {
    return publicApi
      .post<ApiResponse<RegisterResponse>>("/auth/register", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  login(payload: LoginPayload) {
    return publicApi
      .post<ApiResponse<AuthPayload>>("/auth/login", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  refresh(payload: RefreshPayload) {
    return publicApi
      .post<ApiResponse<AuthPayload>>("/auth/refresh", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  selectBusiness(payload: SelectBusinessPayload) {
    return api
      .post<
        ApiResponse<Omit<AuthPayload, "refreshToken" | "businesses">>
      >("/auth/select-business", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  me() {
    return api
      .get<
        ApiResponse<Pick<AuthPayload, "user" | "selectedBusiness" | "businesses">>
      >("/auth/me")
      .then((res) => unwrapApiResponse(res.data));
  },

  logout(payload: LogoutPayload) {
    return api
      .post<ApiResponse<null>>("/auth/logout", payload)
      .then((res) => ({
        message: res.data.message ?? "Logged out successfully",
      }));
  },

  logoutAll() {
    return api
      .post<ApiResponse<null>>("/auth/logout-all")
      .then((res) => ({
        message: res.data.message ?? "Logged out from all devices successfully",
      }));
  },
};
