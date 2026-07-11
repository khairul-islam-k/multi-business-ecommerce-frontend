"use client";

import "react-day-picker/dist/style.css";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, X } from "lucide-react";

import { DayPicker } from "react-day-picker";
import OverviewCard from "../_components/onverview/overview-card";
import { format } from "date-fns";
import { useCustomerOverviewQuery } from "@/lib/api/hooks/customer-overview";
import { useState } from "react";

const DONUT_COLORS = [
  "#1677ff",
  "#52c41a",
  "#faad14",
  "#ff4d4f",
  "#722ed1",
  "#13c2c2",
];

/**
 * Format chart date.
 * If view is "date" => show: 04 Jul 2026
 * If view is "month" => show: Jul 2026
 */
const formatChartDate = (date: string, view: "date" | "month") => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: view === "date" ? "2-digit" : undefined,
    month: "short",
    year: "numeric",
  });
};

/**
 * Format number with comma.
 * Example: 10000 => 10,000
 */
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-BD").format(value);
};

/**
 * Format currency.
 * Example: 10000 => BDT 10,000
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format compact currency for Y axis.
 * Example: 10000 => 10K
 */
const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Convert selected Date object to API start date format.
 * Example output: 2026-06-01T00:00:00.000Z
 */
const toStartOfDayISOString = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
  ).toISOString();
};

/**
 * Convert selected Date object to API end date format.
 * Example output: 2026-06-30T23:59:59.999Z
 */
const toEndOfDayISOString = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    ),
  ).toISOString();
};

/**
 * Reusable chart card wrapper.
 */
const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
};

const FashionDashboard = () => {
  /**
   * Chart view state.
   * "date" means X axis will show exact date.
   * "month" means X axis will show month.
   */
  const [chartView, setChartView] = useState<"date" | "month">("month");

  /**
   * API date filter state.
   * These values will go to API query params.
   */
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  /**
   * Calendar popup open/close state.
   */
  const [fromPickerOpen, setFromPickerOpen] = useState(false);
  const [toPickerOpen, setToPickerOpen] = useState(false);

  /**
   * Selected date values for UI display.
   */
  const [fromDateValue, setFromDateValue] = useState<Date>();
  const [toDateValue, setToDateValue] = useState<Date>();

  /**
   * Fetch overview data.
   * When fromDate or toDate changes, query will refetch if your hook queryKey includes params.
   */
  const { data: customers } = useCustomerOverviewQuery({
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const cards = customers?.cards ?? [];
  const charts = customers?.charts ?? [];

  /**
   * Find chart data by API chart key.
   */
  const ordersChart = charts.find((chart) => chart.key === "ordersOverTime");

  const spendingChart = charts.find(
    (chart) => chart.key === "spendingOverTime",
  );

  const orderStatusChart = charts.find(
    (chart) => chart.key === "orderStatusBreakdown",
  );

  /**
   * Convert API orders chart data to Recharts format.
   */
  const ordersOverTime =
    ordersChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      orders: Number(item.orders ?? 0),
    })) ?? [];

  /**
   * Convert API spending chart data to Recharts format.
   */
  const spendingOverTime =
    spendingChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      spending: Number(item.spending ?? 0),
    })) ?? [];

  /**
   * Convert API order status data to Recharts format.
   */
  const orderStatusData =
    orderStatusChart?.data?.map((item) => ({
      status: String(item.status),
      orders: Number(item.orders ?? 0),
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Filter and chart view controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Date / Month toggle */}
          <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setChartView("date")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                chartView === "date"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Date
            </button>

            <button
              type="button"
              onClick={() => setChartView("month")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                chartView === "month"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Month
            </button>
          </div>

          {/* Beautiful custom calendar filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* From Date */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setFromPickerOpen((prev) => !prev);
                  setToPickerOpen(false);
                }}
                className="flex h-11 min-w-[180px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <span
                  className={fromDateValue ? "text-slate-800" : "text-slate-400"}
                >
                  {fromDateValue
                    ? format(fromDateValue, "dd MMM yyyy")
                    : "From date"}
                </span>

                <CalendarDays size={18} className="text-slate-400" />
              </button>

              {fromPickerOpen && (
                <div className="absolute right-0 z-50 mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <DayPicker
                    mode="single"
                    selected={fromDateValue}
                    onSelect={(date) => {
                      if (!date) return;

                      setFromDateValue(date);
                      setFromDate(toStartOfDayISOString(date));
                      setFromPickerOpen(false);

                      /**
                       * Optional:
                       * If from date is greater than to date,
                       * clear to date.
                       */
                      if (toDateValue && date > toDateValue) {
                        setToDateValue(undefined);
                        setToDate("");
                      }
                    }}
                    captionLayout="dropdown"
                    className="text-sm"
                  />

                  {fromDateValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setFromDateValue(undefined);
                        setFromDate("");
                        setFromPickerOpen(false);
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                    >
                      <X size={16} />
                      Clear date
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* To Date */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setToPickerOpen((prev) => !prev);
                  setFromPickerOpen(false);
                }}
                className="flex h-11 min-w-[180px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <span
                  className={toDateValue ? "text-slate-800" : "text-slate-400"}
                >
                  {toDateValue ? format(toDateValue, "dd MMM yyyy") : "To date"}
                </span>

                <CalendarDays size={18} className="text-slate-400" />
              </button>

              {toPickerOpen && (
                <div className="absolute right-0 z-50 mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <DayPicker
                    mode="single"
                    selected={toDateValue}
                    onSelect={(date) => {
                      if (!date) return;

                      setToDateValue(date);
                      setToDate(toEndOfDayISOString(date));
                      setToPickerOpen(false);
                    }}
                    captionLayout="dropdown"
                    disabled={fromDateValue ? { before: fromDateValue } : undefined}
                    className="text-sm"
                  />

                  {toDateValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setToDateValue(undefined);
                        setToDate("");
                        setToPickerOpen(false);
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                    >
                      <X size={16} />
                      Clear date
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((stat) => (
          <OverviewCard key={stat.key} stat={stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spending line chart */}
        <ChartCard title="Spending Over Time">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={spendingOverTime}
                margin={{ top: 10, right: 20, left: 10, bottom: 55 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `৳${formatCompactCurrency(Number(value))}`
                  }
                />

                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) =>
                    chartView === "date" ? `Date: ${label}` : `Month: ${label}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Orders line chart */}
        <ChartCard title="Orders Over Time">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ordersOverTime}
                margin={{ top: 10, right: 20, left: 10, bottom: 55 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => formatNumber(Number(value))}
                  labelFormatter={(label) =>
                    chartView === "date" ? `Date: ${label}` : `Month: ${label}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Order status donut chart */}
        <ChartCard title="Order Status">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="orders"
                  nameKey="status"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    "Orders",
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Order status bar chart */}
        <ChartCard title="Order Status Bar">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData}
                margin={{ top: 10, right: 20, left: 10, bottom: 65 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="status"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={100}
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    "Orders",
                  ]}
                />

                <Bar
                  dataKey="orders"
                  fill="#52c41a"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default FashionDashboard;
