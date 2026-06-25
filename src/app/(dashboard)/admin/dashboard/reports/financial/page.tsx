"use client";

import {
  Banknote,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  ShoppingCart
} from "lucide-react";



import ReportPage from "../_components/report-page";

export default function FinancialReports() {
  return (
    <ReportPage
      title="Financial Reports"
      description="P&L statements, balance sheet overview, and cash flow analysis"
      stats={[
        {
          label: "Net Revenue",
          value: "₹24,25,000",
          change: "+10.2%",
          up: true,
          icon: Banknote,
        },
        {
          label: "COGS",
          value: "₹14,50,000",
          change: "59.8%",
          up: false, // higher COGS reduces margin
          icon: ShoppingCart,
        },
        {
          label: "Gross Profit",
          value: "₹9,75,000",
          change: "40.2% margin",
          up: true,
          icon: ChartNoAxesColumnIncreasing,
        },
        {
          label: "Net Profit",
          value: "₹4,42,000",
          change: "18.2% margin",
          up: true,
          icon: ChartPie,
        },
      ]}
      chartData={["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
        name: m,
        value: [380, 420, 410, 460, 490, 485][i],
        value2: [180, 210, 195, 230, 245, 240][i],
      }))}
      chartType="line"
      tableHeaders={[
        "Item",
        "Current Period",
        "Previous Period",
        "Change",
        "% Change",
      ]}
      tableRows={[
        ["Gross Revenue", "₹32,45,000", "₹28,90,000", "+₹3,55,000", "+12.3%"],
        ["Returns & Refunds", "₹1,20,000", "₹1,05,000", "+₹15,000", "+14.3%"],
        ["Net Revenue", "₹31,25,000", "₹27,85,000", "+₹3,40,000", "+12.2%"],
        ["Cost of Goods", "₹14,50,000", "₹13,20,000", "+₹1,30,000", "+9.8%"],
        ["Operating Expenses", "₹8,20,000", "₹7,40,000", "+₹80,000", "+10.8%"],
        ["Net Profit", "₹4,42,000", "₹3,65,000", "+₹77,000", "+21.1%"],
      ]}
    />
  );
}
