"use client";

import {
  Copy
} from "lucide-react";


import { Tag, Button, App } from "antd";

import { mockAiGenerations } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { DataTable, Column } from "@/components/shared/data-table";

const moduleLabels: Record<string, string> = {
  product_description: "Description",
  promo_text: "Promo",
  slogan: "Slogan",
  email_copy: "Email",
  ad_copy: "Ad",
};

const columns: Column<any>[] = [
  {
    key: "module_type",
    label: "Type",
    render: (r) => <Tag>{moduleLabels[r.module_type] ?? r.module_type}</Tag>,
  },
  {
    key: "prompt",
    label: "Prompt",
    render: (r) => <span className="max-w-55 truncate block">{r.prompt}</span>,
  },
  {
    key: "generated_text",
    label: "Output",
    render: (r) => (
      <span className="max-w-[320px] truncate block text-sm text-gray-500">
        {r.generated_text}
      </span>
    ),
  },
  { key: "user_id", label: "User" },
  {
    key: "created_at",
    label: "Date",
    render: (r) => new Date(r.created_at).toLocaleDateString(),
  },
];

export default function AiGenerationHistory() {
  const { message } = App.useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="AI Generation History" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockAiGenerations}
        columns={columns}
        actions={(row) => (
          <Button
            type="text"
            icon={<Copy />}
            onClick={() => {
              navigator.clipboard.writeText(row.generated_text);
              message.success("Copied!");
            }}
          />
        )}
      />
    </div>
  );
}
