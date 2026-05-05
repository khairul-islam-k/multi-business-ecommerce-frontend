"use client";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Table, Tag, Space, Button, Card } from "antd";

import LineItemAddFrom from "./line-item-add-form";

export type ModuleStatus = "Active" | "Inactive";

export interface ModuleItem {
  name: string;
  slug: string;
  detail: string;
  icon: string;
  routePath: string;
  sortOrder: number;
  isCore?: boolean;
  status: ModuleStatus;
}

export const moduleData: ModuleItem[] = [
  {
    name: "Inventory",
    slug: "inventory",
    detail: "Manage stock and products",
    icon: "boxes",
    routePath: "/inventory",
    sortOrder: 1,
    isCore: true,
    status: "Active",
  },
  {
    name: "Orders",
    slug: "orders",
    detail: "Order management system",
    icon: "shopping-cart",
    routePath: "/orders",
    sortOrder: 2,
    status: "Active",
  },
];

export default function ModuleMatrixTable() {
  const columns: ColumnsType<ModuleItem> = [
    {
      title: "Module Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <strong>{text}</strong>
          {record.isCore && <Tag color="blue">Core</Tag>}
        </Space>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Route",
      dataIndex: "routePath",
      key: "routePath",
    },
    {
      title: "Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />}></Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* table */}
      <Table
        rowKey="slug"
        columns={columns}
        dataSource={moduleData}
        pagination={false}
        bordered
      />
      {/* ItemAddForm */}
      <Card
        style={{
          marginTop: "10px",
        }}
      >
        <LineItemAddFrom />
      </Card>
    </div>
  );
}
