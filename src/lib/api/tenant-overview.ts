import { unwrapApiResponse } from "./response";
import { ApiId, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { DashboardOverviewResponse } from "@/types/dashboard-overview/tenant";

export const tenantOverviewApi = {


  get(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiResponse<DashboardOverviewResponse>>(`/dashboards/businesses/${businessId}/overview/general${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

};