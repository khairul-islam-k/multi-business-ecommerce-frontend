"use client";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import PerformanceTable from "./_components/PerformanceTable";

const Performance = () => {
  const courierDelivery = [
    {
      month: "January",
      "TCS Express": 200,
      "Leopards Courier": 100,
      PostEx: 95,
    },
    {
      month: "February",
      "TCS Express": 400,
      "Leopards Courier": 340,
      PostEx: 200,
    },
    {
      month: "March",
      "TCS Express": 300,
      "Leopards Courier": 320,
      PostEx: 280,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Courier Performance Report"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Card title="Deliveries by Courier (Monthly)">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={courierDelivery} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Legend />

            <Bar
              dataKey="TCS Express"
              name="TCS Express Delivery"
              fill="var(--dashboard-primary-color)"
            />
            <Bar
              dataKey="Leopards Courier"
              name="Leopards Courier Delivery"
              fill="var(--dashboard-info-color)"
            />
            <Bar dataKey="PostEx" name="PostEx Delivery" fill="var(--dashboard-error-color)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <PerformanceTable />
    </div>
  );
};

export default Performance;
