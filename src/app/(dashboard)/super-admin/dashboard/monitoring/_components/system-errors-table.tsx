"use client";

import {
  Cable,
  Clock
} from "lucide-react";


import { Table, Typography, Badge, Space } from "antd";

const { Text } = Typography;

export type SystemError = {
  id: string;
  service: string;
  message: string;
  time: string;
  tenant: string;
  severity: "critical" | "high" | "medium";
};

export default function SystemErrorsTable({
  errors,
}: {
  errors: SystemError[];
}) {
  const severityConfig = {
    critical: { color: "error", label: "Critical" },
    high: { color: "warning", label: "High" },
    medium: { color: "processing", label: "Medium" },
  };

  const columns = [
    {
      title: "Severity",
      dataIndex: "severity",
      render: (severity: keyof typeof severityConfig) => {
        const config = severityConfig[severity];
        return <Badge status={config.color as any} text={config.label} />;
      },
    },
    {
      title: (
        <Space>
          <Cable />
          Service
        </Space>
      ),
      dataIndex: "service",
      render: (service: string) => <Text code>{service}</Text>,
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
    },
    {
      title: (
        <Space>
          <Clock />
          Time
        </Space>
      ),
      dataIndex: "time",
      width: 180,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={errors}
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
    />
  );
}
