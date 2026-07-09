import { unwrapApiResponse } from "./response";
import { ApiResponse } from "./types";
import { buildQueryString } from "./params";
import { overviewQuery } from "@/types/dashboard-overview/tenant";
import webApi from "../public-api-hook/web-api";
import { CustomerDashboardOverviewResponse } from "@/types/dashboard-overview/customer";

export const customerOverviewApi = {

  get(query?: overviewQuery) {
    return webApi
      .get<ApiResponse<CustomerDashboardOverviewResponse>>(`/dashboards/customer/overview${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

};