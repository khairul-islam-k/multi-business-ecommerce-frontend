"use client";

import {
  ChartBar,
  Pencil,
  UserRound
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { Tag, Button, Space } from "antd";
import { useRouter } from "next/navigation";
import { mockCampaigns, SmsCampaign } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Link from "next/link";

const statusColor: Record<string, string> = {
  draft: "default",
  scheduled: "blue",
  running: "processing",
  completed: "green",
  failed: "red",
};

const columns: Column<SmsCampaign>[] = [
  { key: "name", label: "Campaign" },
  {
    key: "target_type",
    label: "Target",
  },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <Tag color={statusColor[r.status]}>{r.status.toUpperCase()}</Tag>
    ),
  },
  { key: "total_recipients", label: "Recipients" },
  { key: "total_sent", label: "Sent" },
  {
    key: "total_failed",
    label: "Failed",
    render: (r) => (
      <span className={r.total_failed > 0 ? "text-red-500 font-medium" : ""}>
        {r.total_failed}
      </span>
    ),
  },
  {
    key: "scheduled_at",
    label: "Scheduled",
    render: (r) =>
      r.scheduled_at ? new Date(r.scheduled_at).toLocaleDateString() : "—",
  },
];

export default function CampaignList() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="SMS Campaigns" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockCampaigns}
        columns={columns}
        toolbarEnd={
          <Link href="/admin/dashboard/sms/campaigns/create">
            <Button type="primary">Create Campaign</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              icon={<ChartBar />}
              onClick={() =>
                router.push("/admin/dashboard/sms/campaigns/analytics")
              }
            />
            <Button
              icon={<UserRound />}
              onClick={() =>
                router.push("/admin/dashboard/sms/campaigns/recipients")
              }
            />
            <Button icon={<Pencil />} />
          </Space>
        )}
      />
    </div>
  );
}
