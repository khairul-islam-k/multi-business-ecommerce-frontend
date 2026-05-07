"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, Spin, Empty } from "antd";
import { Column, DataTable } from "@/components/shared/data-table";

export default function WebsiteMenu({ websiteId }: { websiteId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["website-menus", websiteId],
    queryFn: async () => {
      const res = await api.get(`/menus`, {
        params: { website_id: websiteId },
      });
      return res.data?.data?.data ?? [];
    },
    enabled: !!websiteId,
  });

  if (isLoading) return <Spin />;
  if (isError) return <Empty description="Failed to load menus" />;

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      render: (r) => <strong>{r.name}</strong>,
    },
    {
      key: "location",
      label: "Location",
      render: (r) => r.location,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => r.status,
    },
  ];

  return (
    <Card>
      <DataTable data={data} columns={columns} />
    </Card>
  );
}
