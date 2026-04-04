"use client";

import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import ReportPage from "../_components/report-page";

export default function OrderReports() {
  return (
    <ReportPage
      title="Order Reports"
      description="Track order volume, fulfillment rates, and order status distribution"
      stats={[
        {
          label: "Total Orders",
          value: "2,450",
          change: "+8.3%",
          up: true,
          icon: ShoppingCartOutlined,
        },
        {
          label: "Fulfilled",
          value: "2,180",
          change: "89%",
          up: true,
          icon: CheckCircleOutlined,
        },
        {
          label: "Pending",
          value: "185",
          change: "7.5%",
          up: false,
          icon: ClockCircleOutlined,
        },
        {
          label: "Cancelled",
          value: "85",
          change: "3.5%",
          up: false,
          icon: CloseCircleOutlined,
        },
      ]}
      chartData={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (d, i) => ({ name: d, value: [120, 145, 135, 160, 180, 210, 190][i] }),
      )}
      tableHeaders={[
        "Order ID",
        "Customer",
        "Items",
        "Total",
        "Status",
        "Date",
      ]}
      tableRows={[
        ["#ORD-2401", "Raj Kumar", "3", "₹4,500", "Delivered", "Jan 15"],
        ["#ORD-2402", "Priya Sharma", "1", "₹2,800", "Shipped", "Jan 16"],
        ["#ORD-2403", "Amit Patel", "5", "₹12,300", "Processing", "Jan 17"],
        ["#ORD-2404", "Neha Singh", "2", "₹3,200", "Delivered", "Jan 18"],
        ["#ORD-2405", "Vikram Joshi", "1", "₹1,500", "Cancelled", "Jan 19"],
      ]}
    />
  );
}
