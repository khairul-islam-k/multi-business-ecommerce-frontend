import type {
  ApiPaginatedResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/api/types";

export function unwrapApiResponse<T>(payload: ApiResponse<T> | T): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    !Array.isArray(payload)
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

export function normalizePaginatedResponse<T>(
  payload: ApiPaginatedResponse<T> | PaginatedResponse<T>,
): PaginatedResponse<T> {
  if ("items" in payload) return payload;

  return {
    items: payload.data,
    meta: payload.meta,
  };
}
