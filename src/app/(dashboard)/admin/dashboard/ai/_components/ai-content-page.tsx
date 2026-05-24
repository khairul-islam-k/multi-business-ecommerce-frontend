"use client";

import { App, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import { mockAiGenerations } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { DataTable, Column } from "@/components/shared/data-table";

const filtered = (type: string) =>
  mockAiGenerations.filter((g) => g.module_type === type);

const columns: Column<any>[] = [
  {
    key: "prompt",
    label: "Prompt",
    render: (r) => (
      <span className="max-w-62.5 truncate block">{r.prompt}</span>
    ),
  },
  {
    key: "generated_text",
    label: "Generated Text",
    render: (r) => (
      <span className="max-w-87.5 truncate block text-sm text-gray-500">
        {r.generated_text}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "Created",
    render: (r) => new Date(r.created_at).toLocaleDateString(),
  },
];

export default function AiContentPage({
  title,
  description,
  moduleType,
}: {
  title: string;
  description: string;
  moduleType: string;
}) {
  const { message } = App.useApp();

  return (
    <div className="space-y-6 ">
      <PageHeader title={title} breadcrumb={adminBreadcrumb} />

      <DataTable
        data={filtered(moduleType)}
        columns={columns}
        actions={(row) => (
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(row.generated_text);
              message.success("Copied");
            }}
          />
        )}
      />
    </div>
  );
}
