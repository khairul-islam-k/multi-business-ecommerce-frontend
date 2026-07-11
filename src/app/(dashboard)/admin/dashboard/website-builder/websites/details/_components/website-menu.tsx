"use client";

import { Card, Empty, Typography } from "antd";

import { Column, DataTable } from "@/components/shared/data-table";
import type { ResponseWebsite } from "@/types/website/website";

const { Text } = Typography;

type NavigationRow = {
  id: string;
  key: string;
  value: unknown;
};

const summarize = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function WebsiteMenu({ website }: { website: ResponseWebsite }) {
  const navigationConfig = website.config?.navigationConfig ?? {};
  const rows: NavigationRow[] = Object.entries(navigationConfig).map(
    ([key, value]) => ({
      id: key,
      key,
      value,
    }),
  );

  if (!rows.length) {
    return <Empty description="No navigation configuration found" />;
  }

  const columns: Column<NavigationRow>[] = [
    {
      key: "key",
      label: "Key",
      type: "primary",
      render: (record) => <strong>{record.key}</strong>,
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
