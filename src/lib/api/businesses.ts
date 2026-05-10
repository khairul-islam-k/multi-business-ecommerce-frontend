import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import type {
  Business,
  BusinessPayload,
  BusinessQuery,
  MessageResponse,
  PaginatedResponse,
} from "@/lib/api/types";

export const businessesApi = {
  list(query?: BusinessQuery) {
    return api
      .get<PaginatedResponse<Business>>(`/businesses${buildQueryString(query)}`)
      .then((res) => res.data);
  },

  create(payload: BusinessPayload) {
    return api.post<Business>("/businesses", payload).then((res) => res.data);
  },

  get(businessId: number) {
    return api.get<Business>(`/businesses/${businessId}`).then((res) => res.data);
  },

  update(businessId: number, payload: Partial<BusinessPayload>) {
    return api
      .patch<Business>(`/businesses/${businessId}`, payload)
      .then((res) => res.data);
  },

  remove(businessId: number) {
    return api
      .delete<MessageResponse>(`/businesses/${businessId}`)
      .then((res) => res.data);
  },
};
