"use client";

import {
  CircleCheck,
  CircleX,
  Send,
  UserRound
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { mockCampaigns } from "../data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const COLORS = ["var(--dashboard-primary-color)", "var(--dashboard-success-color)", "var(--dashboard-error-color)", "var(--dashboard-warning-color)"];

export default function CampaignAnalytics() {
  const stats = mockCampaigns.reduce(
    (acc, c) => ({
      recipients: acc.recipients + c.total_recipients,
      sent: acc.sent + c.total_sent,
      failed: acc.failed + c.total_failed,
    }),
    { recipients: 0, sent: 0, failed: 0 },
  );

  const barData = mockCampaigns.slice(0, 8).map((c) => ({
    name: c.name.slice(0, 15),
    sent: c.total_sent,
    failed: c.total_failed,
  }));

  const pieData = [
    { name: "Delivered", value: stats.sent },
    { name: "Failed", value: stats.failed },
    {
      name: "Pending",
      value: stats.recipients - stats.sent - stats.failed,
    },
  ].filter((d) => d.value > 0);

  const statCards = [
    {
      label: "Total Recipients",
      value: stats.recipients,
      icon: <UserRound />,
    },
    {
      label: "Total Sent",
      value: stats.sent,
      icon: <Send />,
    },
    {
      label: "Delivered",
      value: stats.sent,
      icon: <CircleCheck />,
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: <CircleX />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Campaign Analytics" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <Card key={s.label}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-semibold">
                  {s.value.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl text-gray-400">{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Campaign Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="var(--dashboard-primary-color)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="var(--dashboard-error-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Delivery Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
