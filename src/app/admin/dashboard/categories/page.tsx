"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
  Popconfirm,
  Image,
  message,
  Avatar,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { mockCategories } from "./data";
import ViewModal from "./_components/view-modal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Search } = Input;

export default function CategoriesPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();

  const filtered = mockCategories.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status ? item.status === status : true;

    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    await Promise.resolve(() => setTimeout(() => {}, 1000));
    message.success("Category deleted");
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (src: string) => <Avatar src={src} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Parent",
      dataIndex: "parent_id",
      render: (v: string) => v || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) =>
        s === "Active" ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="default" text="Inactive" />
        ),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelected(record);
              setOpen(true);
            }}
          />

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/admin/dashboard/categories/edit/${record.id}`)
            }
          />

          <Popconfirm
            title="Delete category?"
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
      <PageHeader title="Categories" breadcrumb={adminBreadcrumb} />

      {/* Controls */}
      <div className="flex justify-between gap-3 flex-wrap">
        <div className="flex gap-3">
          <Search
            placeholder="Search categories"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <Select
            placeholder="Status"
            allowClear
            style={{ width: 160 }}
            onChange={setStatus}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        <Button
          type="primary"
          onClick={() => router.push("/admin/dashboard/categories/create")}
          icon={<PlusOutlined />}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>List of Categories</Title>

            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        category={selected}
      />
    </div>
  );
}
