"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, Tag, Spin, Empty } from "antd";
import { Column, DataTable } from "@/components/shared/data-table";

export default function WebsiteDomain({ websiteId }: { websiteId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["website-domains", websiteId],
    queryFn: async () => {
      const res = await api.get(`/domains`, {
        params: { website_id: websiteId },
      });
      return res.data?.data?.data ?? [];
    },
    enabled: !!websiteId,
  });

  if (isLoading) return <Spin />;
  if (isError) return <Empty description="Failed to load domains" />;

  const columns: Column<any>[] = [
    {
      key: "domain",
      label: "Domain",
      type: "primary",
      render: (r) => r.domain,
    },
    {
      key: "dns_status",
      label: "DNS",
      render: (r) => <Tag>{r.dns_status}</Tag>,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <Tag>{r.status}</Tag>,
    },
    {
      key: "is_primary",
      label: "Primary",
      render: (r) => (r.is_primary ? <Tag color="blue">Primary</Tag> : "—"),
    },
  ];

  return (
    <Card>
      <DataTable data={data} columns={columns} />
    </Card>
  );
}
