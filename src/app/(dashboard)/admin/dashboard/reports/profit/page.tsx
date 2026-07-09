"use client";

import {
  Calculator,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  ShoppingCart
} from "lucide-react";



import ReportPage from "../_components/report-page";

export default function ProfitReports() {
  return (
    <ReportPage
      title="Profit Reports"
      description="Analyze profit margins, COGS breakdown, and net profit trends"
      stats={[
        {
          label: "Gross Profit",
          value: "₹9,75,000",
          change: "40.2% margin",
          up: true,
          icon: ChartNoAxesColumnIncreasing,
        },
        {
          label: "Operating Profit",
          value: "₹5,55,000",
          change: "22.9% margin",
          up: true,
          icon: Calculator,
        },
        {
          label: "Net Profit",
          value: "₹4,42,000",
          change: "18.2% margin",
          up: true,
          icon: ChartPie,
        },
        {
          label: "COGS Ratio",
          value: "59.8%",
          change: "-1.2% vs prior",
          up: false,
          icon: ShoppingCart,
        },
      ]}
      chartData={["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
        name: m,
        value: [140, 165, 155, 180, 200, 195][i],
        value2: [60, 72, 68, 82, 90, 88][i],
      }))}
      chartType="bar"
      tableHeaders={[
        "Category",
        "Revenue",
        "COGS",
        "Gross Margin",
        "Net Margin",
      ]}
      tableRows={[
        ["Electronics", "₹12,80,000", "₹8,20,000", "35.9%", "15.2%"],
        ["Clothing", "₹8,40,000", "₹4,20,000", "50.0%", "22.5%"],
        ["Home & Kitchen", "₹5,60,000", "₹3,10,000", "44.6%", "19.8%"],
        ["Sports", "₹3,20,000", "₹1,80,000", "43.8%", "18.1%"],
        ["Books", "₹2,45,000", "₹1,20,000", "51.0%", "24.3%"],
      ]}
    />
  );
}
