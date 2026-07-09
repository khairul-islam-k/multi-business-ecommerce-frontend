export type CustomerDashboardCardFormat = "number" | "currency";

export type CustomerDashboardChartType = "line" | "donut";

export type CustomerDashboardRange = {
  from: string;
  to: string;
};

export type CustomerDashboardCard = {
  key:
    | "orders"
    | "totalSpent"
    | "pendingOrders"
    | "returns"
    | "wishlistItems";
  label: string;
  value: number;
  format: CustomerDashboardCardFormat;
  currencyCode?: string;
};

export type OrdersOverTimeData = {
  date: string;
  orders: string;
};

export type SpendingOverTimeData = {
  date: string;
  spending: string;
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

export type SpendingOverTimeChart = {
  key: "spendingOverTime";
  label: string;
  type: "line";
  data: SpendingOverTimeData[];
};

export type OrderStatusBreakdownChart = {
  key: "orderStatusBreakdown";
  label: string;
  type: "donut";
  data: OrderStatusBreakdownData[];
};

export type CustomerDashboardChart =
  | OrdersOverTimeChart
  | SpendingOverTimeChart
  | OrderStatusBreakdownChart;

export type CustomerDashboardOverviewResponse = {
  range: CustomerDashboardRange;
  cards: CustomerDashboardCard[];
  charts: CustomerDashboardChart[];
};