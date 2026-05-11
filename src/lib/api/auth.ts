import api, { publicApi } from "@/lib/axios";
import type {
  AuthPayload,
  LoginPayload,
  LogoutPayload,
  MessageResponse,
  RefreshPayload,
  RegisterPayload,
  RegisterResponse,
  SelectBusinessPayload,
} from "@/lib/api/types";

export const authApi = {
  register(payload: RegisterPayload) {
    return publicApi
      .post<RegisterResponse>("/auth/register", payload)
      .then((res) => res.data);
  },

  login(payload: LoginPayload) {
    return publicApi
      .post<AuthPayload>("/auth/login", payload)
      .then((res) => res.data);
  },

  refresh(payload: RefreshPayload) {
    return publicApi
      .post<AuthPayload>("/auth/refresh", payload)
      .then((res) => res.data);
  },

  selectBusiness(payload: SelectBusinessPayload) {
    return api
      .post<
        Omit<AuthPayload, "refreshToken" | "businesses">
      >("/auth/select-business", payload)
      .then((res) => res.data);
  },

  me() {
    return api
      .get<
        Pick<AuthPayload, "user" | "selectedBusiness" | "businesses">
      >("/auth/me")
      .then((res) => res.data);
  },

  logout(payload: LogoutPayload) {
    return api
      .post<MessageResponse>("/auth/logout", payload)
      .then((res) => res.data);
  },

  logoutAll() {
    return api
      .post<MessageResponse>("/auth/logout-all")
      .then((res) => res.data);
  },
};
