"use client";

import Link from "next/link";
import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Button, Card, Space, Tag, Flex, theme, Spin, Empty } from "antd";
import {
  GlobalOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Column, DataTable } from "@/components/shared/data-table";
import { useState } from "react";
import Pagination from "@/components/shared/Pagination";

type Website = {
  uuid: string;
  name: string;
  slug: string;
  domain: string;
  subdomain: string;
  status: "Active" | "Inactive" | "Draft";
  published_at: string | null;
  template_id: number;
};

const statusColor: Record<string, string> = {
  Active: "green",
  Draft: "orange",
  Inactive: "red",
};

const WebsiteList = () => {
  const { token } = theme.useToken();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["websites", search, currentPage],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/websites?${params.toString()}&limit=2`, {});

      return res.data?.data;
    },
  });

  const columns: Column<Website>[] = [
    {
      key: "name",
      label: "Website",
      type: "primary",
      render: (row) => (
        <Flex style={{ alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: token.colorBgContainerDisabled,
              height: 32,
              width: 32,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              color: token.colorPrimary,
            }}
          >
            <GlobalOutlined />
          </div>

          <div>
            <h3 style={{ marginBottom: 0 }}>{row.name}</h3>
            <p style={{ margin: 0, fontSize: 12 }}>{row.slug}</p>
          </div>
        </Flex>
      ),
    },
    {
      key: "domain",
      label: "Domain",
      render: (r) => r.domain,
    },
    {
      key: "subdomain",
      label: "Subdomain",
      render: (r) => r.subdomain,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Tag color={statusColor[r.status] || "default"}>{r.status}</Tag>
      ),
    },
    {
      key: "published_at",
      label: "Published",
      render: (r) =>
        r.published_at ? new Date(r.published_at).toLocaleDateString() : "—",
    },
  ];

  const actions = (row: Website) => (
    <Space>
      <Link href={`/admin/dashboard/website-builder/websites/edit/${row.uuid}`}>
        <Button type="text" icon={<SettingOutlined />} />
      </Link>
    </Space>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Websites" breadcrumb={adminBreadcrumb} />

      <Card style={{ marginTop: 20 }}>
        {isLoading ? (
          <Spin />
        ) : isError ? (
          <Empty description="Failed to load websites" />
        ) : (
          <DataTable
            data={data?.data || []}
            onSearch={(q) => {
              setSearch(q);
              setCurrentPage(1);
            }}
            columns={columns}
            loading={isLoading || isFetching}
            toolbarEnd={
              <Link href="/admin/dashboard/website-builder/websites/create-website">
                <Button type="primary" icon={<PlusOutlined />}>
                  Create Website
                </Button>
              </Link>
            }
            actions={actions}
          />
        )}
      </Card>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={data?.meta?.totalPages || 1}
      />
    </div>
  );
};

export default WebsiteList;
