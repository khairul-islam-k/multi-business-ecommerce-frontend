"use client";

import { Card, Progress } from "antd";
import {
  CreditCardOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { mockWallet } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function SmsCreditBalance() {
  const w = mockWallet;

  const usagePercent = Math.round(
    (w.used_this_month / (w.balance + w.used_this_month)) * 100,
  );

  const stats = [
    {
      label: "Available Balance",
      value: w.balance,
      icon: <CreditCardOutlined />,
    },
    {
      label: "Used This Month",
      value: w.used_this_month,
      icon: <ArrowDownOutlined />,
    },
    {
      label: "Last Updated",
      value: new Date(w.updated_at).toLocaleDateString(),
      icon: <ClockCircleOutlined />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="SMS Credit Balance" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-semibold">
                  {typeof s.value === "number"
                    ? s.value.toLocaleString()
                    : s.value}
                </p>
              </div>
              <div className="text-xl text-gray-400">{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Usage */}
      <Card title="Usage This Month">
        <Progress percent={usagePercent} />
        <p className="text-sm text-gray-500 mt-2">
          {usagePercent}% of total credits used this billing period
        </p>
      </Card>
    </div>
  );
}
