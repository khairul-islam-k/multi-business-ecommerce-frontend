"use client";

import {
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import ReportPage from "../_components/report-page";

export default function SupplierReports() {
  return (
    <ReportPage
      title="Supplier Reports"
      description="Evaluate supplier performance, lead times, and procurement costs"
      stats={[
        {
          label: "Active Suppliers",
          value: "34",
          change: "+3 this quarter",
          up: true,
          icon: TeamOutlined,
        },
        {
          label: "Avg Lead Time",
          value: "5.2 days",
          change: "-0.8 days",
          up: false,
          icon: ClockCircleOutlined,
        },
        {
          label: "On-Time Delivery",
          value: "92.4%",
          change: "+1.2%",
          up: true,
          icon: CheckCircleOutlined,
        },
        {
          label: "Total Procurement",
          value: "₹18,50,000",
          change: "+6%",
          up: true,
          icon: DollarOutlined,
        },
      ]}
      chartData={["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({
        name: q,
        value: [1450, 1680, 1520, 1850][i],
      }))}
      tableHeaders={[
        "Supplier",
        "Products",
        "Lead Time",
        "On-Time %",
        "Total Orders",
        "Rating",
      ]}
      tableRows={[
        ["MegaSupply Co", "Electronics", "3 days", "98%", "245", "4.8"],
        ["TextilePro", "Clothing", "5 days", "94%", "180", "4.5"],
        ["HomeGoods Ltd", "Home & Kitchen", "7 days", "88%", "120", "4.2"],
        ["SportGear Inc", "Sports", "4 days", "96%", "90", "4.6"],
        ["BookWorld", "Books & Media", "6 days", "91%", "75", "4.3"],
      ]}
    />
  );
}
