export type PlatformDashboardCardFormat = "number" | "currency";

export type PlatformDashboardChartType = "line";

export type PlatformDashboardRange = {
  from: string;
  to: string;
};

export type PlatformDashboardCard = {
  key:
    | "tenants"
    | "activeTenants"
    | "businesses"
    | "activeBusinesses"
    | "orders"
    | "platformOrderRevenue"
    | "activeSubscriptions"
    | "packageRevenue";
  label: string;
  value: number;
  format: PlatformDashboardCardFormat;
  currencyCode?: string;
};

export type TenantsOverTimeData = {
  date: string;
  tenants: string;
};

export type BusinessesOverTimeData = {
  date: string;
  businesses: string;
};

export type OrdersOverTimeData = {
  date: string;
  orders: string;
};

export type RevenueOverTimeData = {
  date: string;
  revenue: string;
};

export type TenantsOverTimeChart = {
  key: "tenantsOverTime";
  label: string;
  type: "line";
  data: TenantsOverTimeData[];
};

export type BusinessesOverTimeChart = {
  key: "businessesOverTime";
  label: string;
  type: "line";
  data: BusinessesOverTimeData[];
};

export type OrdersOverTimeChart = {
  key: "ordersOverTime";
  label: string;
  type: "line";
  data: OrdersOverTimeData[];
};

export type RevenueOverTimeChart = {
  key: "revenueOverTime";
  label: string;
  type: "line";
  data: RevenueOverTimeData[];
};

export type PlatformDashboardChart =
  | TenantsOverTimeChart
  | BusinessesOverTimeChart
  | OrdersOverTimeChart
  | RevenueOverTimeChart;

export type SuperAdminOverviewResponse = {
  range: PlatformDashboardRange;
  cards: PlatformDashboardCard[];
  charts: PlatformDashboardChart[];
};