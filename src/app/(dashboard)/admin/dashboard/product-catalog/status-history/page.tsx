"use client";

import React, { useState } from "react";
import { Card, Input, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const statusChanges = [
  {
    id: 1,
    product: "USB-C Charger",
    status_change: "Active → Inactive",
    changed_by: "Admin John",
    date: "2026-04-01 10:15 AM",
  },
  {
    id: 2,
    product: "Wireless Mouse",
    status_change: "Draft → Active",
    changed_by: "Admin Sarah",
    date: "2026-04-01 11:30 AM",
  },
  {
    id: 3,
    product: "USB-C Cable",
    status_change: "Inactive → Active",
    changed_by: "Admin John",
    date: "2026-04-01 01:45 PM",
  },
  {
    id: 4,
    product: "Wireless Keyboard",
    status_change: "Active → Draft",
    changed_by: "Admin Mike",
    date: "2026-04-01 03:20 PM",
  },
  {
    id: 5,
    product: "Power Bank",
    status_change: "Draft → Inactive",
    changed_by: "Admin Sarah",
    date: "2026-04-01 04:50 PM",
  },
];

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Product", dataIndex: "product", key: "product" },
  {
    title: "Status Change",
    dataIndex: "status_change",
    key: "status_change",
    render: (status: string) => {
      let color = "blue";

      if (status.includes("Active → Inactive")) color = "red";
      else if (status.includes("Draft → Active")) color = "green";
      else if (status.includes("Inactive → Active")) color = "green";
      else if (status.includes("Active → Draft")) color = "orange";
      else if (status.includes("Draft → Inactive")) color = "volcano";

      return <Tag color={color}>{status}</Tag>;
    },
  },
  { title: "Changed By", dataIndex: "changed_by", key: "changed_by" },
  { title: "Date", dataIndex: "date", key: "date" },
];

const StatusHistory: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Product Status History"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Track all product status transitions over time.</p>

      <Card>
        <Input
          placeholder="Filter product name..."
          prefix={<SearchOutlined />}
          style={{ maxWidth: 280, marginBottom: "8px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table
          rowKey="id"
          dataSource={statusChanges}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default StatusHistory;
