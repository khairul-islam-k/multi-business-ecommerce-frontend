import { CreatePosSalePayload, PosSaleResponse } from "@/types/pos";
import api from "../axios";
import { unwrapApiResponse } from "./response";
import { ApiId, ApiResponse } from "./types";

const basePath = (businessId: ApiId) => `/pos/businesses/${businessId}/sales`;

export const posApi = {
  createSale(businessId: ApiId, payload: CreatePosSalePayload) {
    return api
      .post<ApiResponse<PosSaleResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
};
