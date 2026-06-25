"use client";

import {
  Eye,
  Pencil,
  Trash2
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { Tag, Button, Space } from "antd";
import { useRouter } from "next/navigation";
import { mockTemplates, SmsTemplate } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Link from "next/link";

const statusColorMap: Record<string, string> = {
  active: "green",
  draft: "gold",
  inactive: "red",
};

const columns: Column<SmsTemplate>[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "content",
    label: "Content",
    render: (r) => (
      <span className="max-w-75 truncate block text-sm text-gray-500">
        {r.content}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => (
      <Tag color={statusColorMap[r.status]}>{r.status.toUpperCase()}</Tag>
    ),
  },
];

export default function SmsTemplateList() {
  return (
    <div className="space-y-6">
      <PageHeader title="SMS Templates" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockTemplates}
        columns={columns}
        toolbarEnd={
          <Link href="/admin/dashboard/sms/templates/create">
            <Button type="primary">Create Template</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button icon={<Eye />} onClick={() => console.log(row)} />
            <Button icon={<Pencil />} onClick={() => console.log(row)} />
            <Button
              danger
              icon={<Trash2 />}
              onClick={() => console.log(row)}
            />
          </Space>
        )}
      />
    </div>
  );
}
