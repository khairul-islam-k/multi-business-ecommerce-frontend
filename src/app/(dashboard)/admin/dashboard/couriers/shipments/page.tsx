"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const shipmentData = [
  {
    id: 1,
    Tracking: "TCS-78901234",
    Order: "ORD-2026-101",
    Courier: "TCS Express",
    Customer: "Ahmed Khan",
    City: "Islamabad",
    Shipped: "3/25/2026",
    Status: "Delivered",
  },
  {
    id: 2,
    Tracking: "TCS-78901235",
    Order: "ORD-2026-102",
    Courier: "TCS Express",
    Customer: "Sara Ali",
    City: "Karachi",
    Shipped: "3/26/2026",
    Status: "In Transit",
  },
  {
    id: 3,
    Tracking: "LEO-45678901",
    Order: "ORD-2026-103",
    Courier: "Leopards Courier",
    Customer: "Bilal Ahmed",
    City: "Lahore",
    Shipped: "3/26/2026",
    Status: "Pending",
  },
  {
    id: 4,
    Tracking: "DHL-12345678",
    Order: "ORD-2026-104",
    Courier: "DHL Express",
    Customer: "Ayesha Khan",
    City: "Islamabad",
    Shipped: "3/27/2026",
    Status: "Delivered",
  },
  {
    id: 5,
    Tracking: "FDX-98765432",
    Order: "ORD-2026-105",
    Courier: "FedEx",
    Customer: "Hassan Shah",
    City: "Karachi",
    Shipped: "3/27/2026",
    Status: "In Transit",
  },
];

const ShipmentPage = () => {
  const screens = Grid.useBreakpoint();
  const [filterProduct, setFilterProduct] = useState<string>("All");

  const columns = [
    { title: "Tracking #", dataIndex: "Tracking", key: "tracking" },
    { title: "Order #", dataIndex: "Order", key: "order" },
    { title: "Courier", dataIndex: "Courier", key: "courier" },
    { title: "Customer", dataIndex: "Customer", key: "customer" },
    { title: "City", dataIndex: "City", key: "city" },
    { title: "Shipped", dataIndex: "Shipped", key: "shipped" },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Delivered") color = "green";
        else if (status === "Pending") color = "orange";
        else if (status === "In Transit") color = "purple";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => (
        <Link
          href={`/admin/dashboard/couriers/shipments/tracking/${record.id}`}
        >
          <Button type="primary">Track</Button>
        </Link>
      ),
    },
  ];

  const handleSearch = (searchData: string) => {
    console.log("search", searchData);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Courier Shipments"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      {/* Search and filter */}
      <Card>
        <Flex
          justify="space-between"
          wrap="wrap"
          style={{ marginBottom: "10px" }}
        >
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Shipments
            </h3>
          </div>

          <Space style={{ marginBottom: 16 }}>
            <Input
              style={{
                width: screens.lg ? "330px" : "100%",
              }}
              prefix={<SearchOutlined />}
              placeholder="Search packages..."
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Select
              value={filterProduct}
              style={{ width: 140 }}
              onChange={setFilterProduct}
            >
              <option value="All">Status All</option>
              <option value="Pending">Pending</option>
              <option value="IN Tracking">IN Tracking</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
            </Select>
          </Space>
        </Flex>

        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={shipmentData}
            bordered
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ShipmentPage;
