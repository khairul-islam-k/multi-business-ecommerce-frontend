"use client";

import {
  Banknote,
  ChartBar,
  ChartLine,
  Undo2
} from "lucide-react";


import ReportPage from "../_components/report-page";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function SalesReports() {
  return (
    <ReportPage
      title="Sales Reports"
      description="Analyze revenue trends, top-selling products, and sales performance"
      stats={[
        {
          label: "Total Sales",
          value: "₹32,45,000",
          change: "+12.5%",
          up: true,
          icon: Banknote,
        },
        {
          label: "Avg. Order Value",
          value: "₹1,325",
          change: "-2.1%",
          up: false,
          icon: ChartBar,
        },
        {
          label: "Conversion Rate",
          value: "3.8%",
          change: "+0.5%",
          up: true,
          icon: ChartLine,
        },
        {
          label: "Refund Rate",
          value: "2.1%",
          change: "-0.3%",
          up: false,
          icon: Undo2,
        },
      ]}
      chartData={months.map((m, i) => ({
        name: m,
        value: [420, 580, 510, 640, 720, 690][i],
      }))}
      chartType="line"
      tableHeaders={[
        "Product",
        "Units Sold",
        "Revenue",
        "Avg. Price",
        "Growth",
      ]}
      tableRows={[
        ["Premium T-Shirt", "450", "₹4,50,000", "₹1,000", "+15%"],
        ["Wireless Earbuds", "320", "₹9,60,000", "₹3,000", "+22%"],
        ["Laptop Stand", "280", "₹4,20,000", "₹1,500", "+8%"],
        ["Phone Case", "890", "₹2,67,000", "₹300", "-5%"],
        ["USB-C Hub", "190", "₹2,85,000", "₹1,500", "+30%"],
      ]}
    />
  );
}
