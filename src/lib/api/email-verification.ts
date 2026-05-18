import api from "../axios";
import { unwrapApiResponse } from "./response";
import { ApiResponse, SendOtpResponse, TEmail, VerifiedResponse, VerifyEmailPayload } from "./types";

export const emailVerifyApi = {
  Send(email: TEmail) {
    return api
      .post<ApiResponse<SendOtpResponse>>('/auth/verify-email/request', { email })
      .then((res) => unwrapApiResponse(res.data));
  },
  verify(payload: VerifyEmailPayload) {
    return api
      .post<ApiResponse<VerifiedResponse>>("/auth/verify-email", payload)
      .then((res) => unwrapApiResponse(res.data));
  },

};