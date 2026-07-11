"use client";

import { Card, Tag, Typography } from "antd";

import { Column, DataTable } from "@/components/shared/data-table";
import type { ResponseWebsite } from "@/types/website/website";

const { Text } = Typography;

type ConfigRow = {
  id: string;
  section: string;
  status: string;
  value?: unknown;
};

const hasValue = (value: unknown) => {
  if (!value || typeof value !== "object") return Boolean(value);
  return Object.keys(value).length > 0;
};

const summarize = (value: unknown) => {
  if (!hasValue(value)) return "-";
  return JSON.stringify(value);
};

export default function WebsitePage({ website }: { website: ResponseWebsite }) {
  const rows: ConfigRow[] = [
    {
      id: "header",
      section: "Header",
      status: hasValue(website.config?.headerConfig) ? "Configured" : "Empty",
      value: website.config?.headerConfig,
    },
    {
      id: "footer",
      section: "Footer",
      status: hasValue(website.config?.footerConfig) ? "Configured" : "Empty",
      value: website.config?.footerConfig,
    },
    {
      id: "sections",
      section: "Sections",
      status: hasValue(website.config?.sectionConfig) ? "Configured" : "Empty",
      value: website.config?.sectionConfig,
    },
    {
      id: "general",
      section: "General",
      status: hasValue(website.config?.generalConfig) ? "Configured" : "Empty",
      value: website.config?.generalConfig,
    },
    {
      id: "theme",
      section: "Theme",
      status: website.theme ? "Configured" : "Empty",
      value: website.theme,
    },
    {
      id: "seo",
      section: "SEO",
      status: website.seo ? "Configured" : "Empty",
      value: website.seo,
    },
  ];

  const columns: Column<ConfigRow>[] = [
    {
      key: "section",
      label: "Section",
      type: "primary",
      render: (record) => <strong>{record.section}</strong>,
    },
    {
      key: "status",
      label: "Status",
      render: (record) => (
        <Tag color={record.status === "Configured" ? "green" : "default"}>
          {record.status}
        </Tag>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (record) => (
        <Text className="max-w-xl block truncate" title={summarize(record.value)}>
          {summarize(record.value)}
        </Text>
      ),
    },
  ];

  return (
    <Card>
      <DataTable data={rows} columns={columns} isSearch={false} />
    </Card>
  );
}
