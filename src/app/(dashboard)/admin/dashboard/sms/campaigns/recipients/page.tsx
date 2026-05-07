"use client";

import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { Tag } from "antd";
import { mockRecipients, SmsCampaignRecipient } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const statusColor: Record<string, string> = {
  delivered: "green",
  sent: "blue",
  pending: "gold",
  failed: "red",
};

const columns: Column<SmsCampaignRecipient>[] = [
  { key: "phone", label: "Phone" },
  {
    key: "delivery_status",
    label: "Status",
    render: (r) => (
      <Tag color={statusColor[r.delivery_status]}>
        {r.delivery_status.toUpperCase()}
      </Tag>
    ),
  },
  {
    key: "sent_at",
    label: "Sent At",
    render: (r) => (r.sent_at ? new Date(r.sent_at).toLocaleString() : "—"),
  },
  {
    key: "sms_campaign_id",
    label: "Campaign ID",
    render: (r) => (
      <span className="text-xs text-gray-400 font-mono">
        {r.sms_campaign_id.slice(0, 8)}...
      </span>
    ),
  },
];

export default function CampaignRecipientLog() {
  return (
    <div className="space-y-6">
      <PageHeader title="Campaign Recipient Log" breadcrumb={adminBreadcrumb} />

      <DataTable data={mockRecipients} columns={columns} />
    </div>
  );
}
