"use client";

import { Card, Tabs } from "antd";

import { mockErrors, mockLogs } from "./data";
import PageHeader from "@/components/shared/page-header";
import SystemLogsTable from "./_components/system-logs-table";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import SystemErrorsTable from "./_components/system-errors-table";

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Monitoring" breadcrumb={superAdminBreadcrumb} />

      <Card>
        <Tabs
          items={[
            {
              key: "logs",
              label: "System Logs",
              children: <SystemLogsTable logs={mockLogs} />,
            },
            {
              key: "errors",
              label: "System Errors",
              children: <SystemErrorsTable errors={mockErrors} />,
            },
          ]}
        />
      </Card>
    </div>
  );
}
