"use client";

import {
  DollarOutlined,
  CloudOutlined,
  ShopOutlined,
  RiseOutlined,
} from "@ant-design/icons";

import ReportPage from "../_components/report-page";

export default function RevenueReports() {
  return (
    <ReportPage
      title="Revenue Reports"
      description="Revenue breakdown by channel, category, and growth trends"
      stats={[
        {
          label: "Total Revenue",
          value: "₹32,45,000",
          change: "+12.5%",
          up: true,
          icon: DollarOutlined,
        },
        {
          label: "Online Revenue",
          value: "₹28,20,000",
          change: "87% of total",
          up: true,
          icon: CloudOutlined,
        },
        {
          label: "Offline Revenue",
          value: "₹4,25,000",
          change: "13% of total",
          up: true,
          icon: ShopOutlined,
        },
        {
          label: "MoM Growth",
          value: "8.3%",
          change: "+2.1% vs prior",
          up: true,
          icon: RiseOutlined,
        },
      ]}
      chartData={["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
        name: m,
        value: [480, 520, 510, 580, 640, 690][i],
      }))}
      chartType="bar"
      tableHeaders={[
        "Channel",
        "Revenue",
        "Orders",
        "Avg Order Value",
        "Growth",
      ]}
      tableRows={[
        ["Website", "₹18,40,000", "1,380", "₹1,333", "+14%"],
        ["Mobile App", "₹9,80,000", "820", "₹1,195", "+18%"],
        ["Marketplace", "₹2,85,000", "190", "₹1,500", "+5%"],
        ["Retail Store", "₹1,40,000", "60", "₹2,333", "-2%"],
      ]}
    />
  );
}
