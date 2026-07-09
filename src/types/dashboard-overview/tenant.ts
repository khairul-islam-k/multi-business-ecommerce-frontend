import { ListQuery } from "@/lib/api";

export type DashboardCardFormat = "number" | "currency";

export type DashboardChartType = "line" | "donut";

export type DashboardRange = {
  from: string;
  to: string;
};

export type DashboardCard = {
  key:
    | "orders"
    | "revenue"
    | "customers"
    | "products"
    | "variants"
    | "lowStockItems";
  label: string;
  value: number;
  format: DashboardCardFormat;
  currencyCode?: string;
};

export type OrdersOverTimeData = {
  date: string;
  orders: string;
};

export type RevenueOverTimeData = {
  date: string;
  revenue: string;
};

export type OrderStatusBreakdownData = {
  status: string;
  orders: number;
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

export type OrderStatusBreakdownChart = {
  key: "orderStatusBreakdown";
  label: string;
  type: "donut";
  data: OrderStatusBreakdownData[];
};

export type DashboardChart =
  | OrdersOverTimeChart
  | RevenueOverTimeChart
  | OrderStatusBreakdownChart;

export type DashboardOverviewResponse = {
  range: DashboardRange;
  cards: DashboardCard[];
  charts: DashboardChart[];
};

// query
export type overviewQuery = ListQuery & {
  from?: string;
  to?: string;
};
