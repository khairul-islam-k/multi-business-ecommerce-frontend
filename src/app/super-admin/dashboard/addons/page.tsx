"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Table,
  Tag,
  message,
  Space,
  Typography,
  Grid,
  Flex,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { mockAddons } from "./data";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

export default function AddonsPage() {
  const router = useRouter();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [msgApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = mockAddons.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    await Promise.resolve(() => setTimeout(() => {}, 1000));
    message.success("Addon deleted");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (v: string) => <Text>{v}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "Limit Key",
      dataIndex: "limitKey",
      render: (v: string) => (
        <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</Text>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (v: string) => `$${v}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag
          style={{
            background: status === "Active" ? "#21c45d" : "#ef4444",
            color: "white",
          }}
          color={status === "Active" ? "green" : "red"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 60,
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/super-admin/dashboard/addons/edit/${record.id}`)
            }
          />

          <Popconfirm
            title="Delete addon?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}

      <PageHeader title="Addons" breadcrumb={superAdminBreadcrumb} />

      <Card>
        <Flex justify="space-between" wrap="wrap">
          <Space style={{ marginBottom: 16 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search addons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: screens.lg ? 300 : "100%" }}
            />
          </Space>

          <Link href="/super-admin/dashboard/addons/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Addon
            </Button>
          </Link>
        </Flex>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
