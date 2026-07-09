"use client";

import { Card, Tag } from "antd";

import { Column, DataTable } from "@/components/shared/data-table";
import type { ResponseWebsite, ResponseWebsiteDomain } from "@/types/website/website";

export default function WebsiteDomain({ website }: { website: ResponseWebsite }) {
  const columns: Column<ResponseWebsiteDomain>[] = [
    {
      key: "domain",
      label: "Domain",
      type: "primary",
      render: (record) => record.domain ?? record.subdomain ?? "-",
    },
    {
      key: "domainType",
      label: "Type",
      render: (record) => record.domainType ?? "-",
    },
    {
      key: "verificationStatus",
      label: "Verification",
      render: (record) => <Tag>{record.verificationStatus ?? "-"}</Tag>,
    },
    {
      key: "sslStatus",
      label: "SSL",
      render: (record) => <Tag>{record.sslStatus ?? "-"}</Tag>,
    },
    {
      key: "isPrimary",
      label: "Primary",
      render: (record) =>
        record.isPrimary ? <Tag color="blue">Primary</Tag> : "-",
    },
  ];

  return (
    <Card>
      <DataTable data={website.domains ?? []} columns={columns} />
    </Card>
  );
}
