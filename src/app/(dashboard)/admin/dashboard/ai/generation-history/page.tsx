"use client";

import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { mockAiGenerations, AiGeneration } from "../data";
import { Tag, Button, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

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
    sortable: true,
    filterOptions: [
      "product_description",
      "promo_text",
      "slogan",
      "email_copy",
      "ad_copy",
    ],
    render: (r) => <Tag>{moduleLabels[r.module_type] ?? r.module_type}</Tag>,
  },
  {
    key: "prompt",
    label: "Prompt",
    sortable: true,
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
  { key: "user_id", label: "User", sortable: true },
  {
    key: "created_at",
    label: "Date",
    sortable: true,
    render: (r) => new Date(r.created_at).toLocaleDateString(),
  },
];

export default function AiGenerationHistory() {
  const swal = useSwal();

  return (
    <div className="space-y-6">
      <PageHeader title="AI Generation History" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockAiGenerations}
        columns={columns}
        searchKeys={["prompt", "generated_text"]}
        actions={(row) => (
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(row.generated_text);
              swal.success("Copied!");
            }}
          />
        )}
      />
    </div>
  );
}
