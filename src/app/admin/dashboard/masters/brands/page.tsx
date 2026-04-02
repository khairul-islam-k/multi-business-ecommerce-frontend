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
  message,
  Avatar,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { mockBrands } from "./data";
import ViewModal from "./_components/view-modal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Search } = Input;

export default function BrandsPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();

  const filtered = mockBrands.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? item.status === status : true;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success("Brand deleted");
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
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
              router.push(`/admin/dashboard/settings/brands/edit/${record.id}`)
            }
          />

          <Popconfirm
            title="Delete brand?"
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
      <PageHeader title="Brands" breadcrumb={adminBreadcrumb} />

      {/* Controls */}
      <div className="flex justify-between gap-3 flex-wrap">
        <div className="flex gap-3">
          <Search
            placeholder="Search brands"
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
          icon={<PlusOutlined />}
          onClick={() => router.push("/admin/dashboard/settings/brands/create")}
        >
          Add Brand
        </Button>
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>List of Brands</Title>

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

      <ViewModal open={open} onClose={() => setOpen(false)} brand={selected} />
    </div>
  );
}
