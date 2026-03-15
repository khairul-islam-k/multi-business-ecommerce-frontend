"use client";

import { Card, Tabs } from "antd";
import PageHeader from "@/components/shared/page-header";

import SystemLogsTable, {
  Log,
} from "@/components/super-admin/monitoring/system-logs-table";
import SystemErrorsTable, {
  SystemError,
} from "@/components/super-admin/monitoring/system-errors-table";

export default function MonitoringPage() {
  const logs: Log[] = [
    {
      id: "1",
      level: "error",
      service: "auth-service",
      message: "Failed login attempt from IP 192.168.1.45",
      timestamp: "2024-03-12 14:32:01",
    },
    {
      id: "2",
      level: "warning",
      service: "billing-service",
      message: "Payment retry scheduled for tenant #45",
      timestamp: "2024-03-12 14:28:15",
    },
    {
      id: "3",
      level: "info",
      service: "tenant-service",
      message: "Tenant 'LogiTrack' provisioned successfully",
      timestamp: "2024-03-12 14:25:00",
    },
    {
      id: "4",
      level: "error",
      service: "api-gateway",
      message: "Rate limit exceeded for tenant #23",
      timestamp: "2024-03-12 14:20:33",
    },
    {
      id: "5",
      level: "info",
      service: "backup-service",
      message: "Daily backup completed - 2.3GB",
      timestamp: "2024-03-12 14:00:00",
    },
    {
      id: "6",
      level: "warning",
      service: "storage-service",
      message: "Storage usage at 85% for tenant #12",
      timestamp: "2024-03-12 13:45:22",
    },
  ];

  const errors: SystemError[] = [
    {
      id: "1",
      service: "auth-service",
      message: "Connection timeout to identity provider",
      time: "2024-03-12 14:32",
      tenant: "Acme Corp",
      severity: "critical",
    },
    {
      id: "2",
      service: "billing-service",
      message: "Stripe webhook signature verification failed",
      time: "2024-03-12 14:15",
      tenant: "TechStart Inc",
      severity: "high",
    },
    {
      id: "3",
      service: "api-gateway",
      message: "502 Bad Gateway on /api/v1/orders",
      time: "2024-03-12 13:50",
      tenant: "RetailHub",
      severity: "medium",
    },
    {
      id: "4",
      service: "storage-service",
      message: "S3 bucket access denied",
      time: "2024-03-12 13:30",
      tenant: "FoodChain Co",
      severity: "high",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="System Monitoring" />

      <Card>
        <Tabs
          items={[
            {
              key: "logs",
              label: "System Logs",
              children: <SystemLogsTable logs={logs} />,
            },
            {
              key: "errors",
              label: "System Errors",
              children: <SystemErrorsTable errors={errors} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
