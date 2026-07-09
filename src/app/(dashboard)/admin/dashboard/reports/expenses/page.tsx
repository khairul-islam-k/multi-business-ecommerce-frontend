"use client";

import {
  Banknote,
  ChartBar,
  ChartLine,
  ChartNoAxesColumnIncreasing
} from "lucide-react";


import ReportPage from "../_components/report-page";

export default function ExpenseReports() {
  return (
    <ReportPage
      title="Expense Reports"
      description="Track operating expenses, cost categories, and budget utilization"
      // stats={[
      //   {
      //     label: "Total Expenses",
      //     value: "৳8,20,000",
      //     change: "+5.2%",
      //     up: false,
      //     icon: Banknote,
      //   },
      //   {
      //     label: "Marketing",
      //     value: "৳2,40,000",
      //     change: "29% of total",
      //     up: true,
      //     icon: ChartBar,
      //   },
      //   {
      //     label: "Operations",
      //     value: "৳3,80,000",
      //     change: "46% of total",
      //     up: true,
      //     icon: ChartNoAxesColumnIncreasing,
      //   },
      //   {
      //     label: "Budget Utilization",
      //     value: "78%",
      //     change: "On track",
      //     up: true,
      //     icon: ChartLine,
      //   },
      // ]}
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
