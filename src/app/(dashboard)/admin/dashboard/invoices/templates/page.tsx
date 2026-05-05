"use client";

import Link from "next/link";
import { Table, Button, Tag, Space, Card, Input } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";

import { mockData } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Search } = Input;

const statusColor = {
  active: "green",
  draft: "orange",
};

export default function InvoiceTemplates() {
  const columns = [
    {
      title: "Template Name",
      dataIndex: "name",
      render: (text: string) => <b>{text}</b>,
    },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColor[status as keyof typeof statusColor]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Used",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => `${r.usage} invoices`,
    },
    { title: "Last Modified", dataIndex: "lastModified" },
    {
      title: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <Space>
          <Button icon={<EyeOutlined />} />
          <Link href={`/admin/dashboard/invoices/templates/edit/${r.key}`}>
            <Button icon={<EditOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Invoice Templates" breadcrumb={adminBreadcrumb} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <Search placeholder="Search templates..." style={{ maxWidth: 300 }} />

        <Button type="primary" icon={<PlusOutlined />}>
          New Template
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={mockData} pagination={false} />
      </Card>
    </div>
  );
}
