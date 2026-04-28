"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, Spin, Empty, Tag } from "antd";
import { Column, DataTable } from "@/components/shared/data-table";

export default function WebsitePage({ websiteId }: { websiteId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["website-pages", websiteId],
    queryFn: async () => {
      const res = await api.get(`/pages`, {
        params: { website_id: websiteId },
      });
      return res.data?.data?.data ?? [];
    },
    enabled: !!websiteId,
  });

  if (isLoading) return <Spin />;
  if (isError) return <Empty description="Failed to load pages" />;

  const columns: Column<any>[] = [
    {
      key: "title",
      label: "Title",
      type: "primary",
      render: (r) => r.title,
    },
    {
      key: "type",
      label: "Type",
      render: (r) => r.type,
    },
    {
      key: "slug",
      label: "Slug",
      render: (r) => r.slug,
    },
    {
      key: "seo_title",
      label: "SEO Title",
      render: (r) => r.seo_title,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Tag color={r.status === "published" ? "green" : "orange"}>
          {r.status}
        </Tag>
      ),
    },
  ];

  return (
    <Card>
      <DataTable data={data} columns={columns} />
    </Card>
  );
}
