"use client";

import {
  BarChartOutlined,
  DollarOutlined,
  FundOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import ReportPage from "../_components/report-page";

export default function ExpenseReports() {
  return (
    <ReportPage
      title="Expense Reports"
      description="Track operating expenses, cost categories, and budget utilization"
      stats={[
        {
          label: "Total Expenses",
          value: "৳8,20,000",
          change: "+5.2%",
          up: false,
          icon: DollarOutlined,
        },
        {
          label: "Marketing",
          value: "৳2,40,000",
          change: "29% of total",
          up: true,
          icon: BarChartOutlined,
        },
        {
          label: "Operations",
          value: "৳3,80,000",
          change: "46% of total",
          up: true,
          icon: FundOutlined,
        },
        {
          label: "Budget Utilization",
          value: "78%",
          change: "On track",
          up: true,
          icon: LineChartOutlined,
        },
      ]}
      chartData={[
        { name: "Jan", value: 120 },
        { name: "Feb", value: 135 },
        { name: "Mar", value: 128 },
        { name: "Apr", value: 145 },
        { name: "May", value: 140 },
        { name: "Jun", value: 152 },
      ]}
      chartType="line"
      tableHeaders={["Category", "Budget", "Spent", "Remaining", "Utilization"]}
      tableRows={[
        ["Marketing & Ads", "৳3,00,000", "৳2,40,000", "৳60,000", "80%"],
        ["Shipping & Logistics", "৳2,50,000", "৳2,10,000", "৳40,000", "84%"],
        ["Staff & Payroll", "৳4,00,000", "৳3,80,000", "৳20,000", "95%"],
        ["Software & Tools", "৳80,000", "৳62,000", "৳18,000", "78%"],
        ["Miscellaneous", "৳50,000", "৳28,000", "৳22,000", "56%"],
      ]}
    />
  );
}
