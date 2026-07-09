import { unwrapApiResponse } from "./response";
import { ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { overviewQuery } from "@/types/dashboard-overview/tenant";
import { SuperAdminOverviewResponse } from "@/types/dashboard-overview/super-admin";

export const superAdminOverviewApi = {

  get(query?: overviewQuery) {
    return api
      .get<ApiResponse<SuperAdminOverviewResponse>>(`/dashboards/admin/overview${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

};