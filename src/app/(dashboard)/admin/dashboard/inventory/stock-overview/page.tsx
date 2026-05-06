"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Col, Grid, Input, Row, Table, Typography } from "antd";

import api from "@/lib/axios";
import { mockStats } from "./data";
import StatCard from "@/components/shared/stat-card";
import Pagination from "@/components/shared/pagination";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

export default function StockOverviewPage() {
  const screens = Grid.useBreakpoint();
  const [searchText, setSearchText] = useState<string>("");
  const [value] = useDebounce(searchText, 1000);

  const tenantId = 1;

  // pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: inventories } = useQuery({
    queryKey: ["inventory", value, tenantId, limit, page],
    queryFn: async () =>
      await api.get(
        `/overview?search=${value}&tenantId=${tenantId}&page=${page}&limit=${limit}&sortBy=created_at&sortOrder=DESC`,
      ),
  });

  console.log("inventories", inventories?.data?.data?.data);

  // pagination
  const total = inventories?.data?.data?.meta?.total;
  const totalPages = Math.ceil(total / limit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inventoryColumns: ColumnsType<any> = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => <Text strong>{record.product?.name ?? "-"}</Text>,
    },
    {
      title: "SKU",
      key: "sku",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: string, record: any) => (
        <Text type="secondary">{record.product?.sku ?? "-"}</Text>
      ),
    },
    {
      title: "Warehouse",
      key: "warehouse",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: string, record: any) => record.warehouse?.name ?? "-",
    },
    {
      title: "Available",
      dataIndex: "availableQty",
      key: "availableQty",
      align: "right",
    },
    {
      title: "Reserved",
      dataIndex: "reservedQty",
      key: "reservedQty",
      align: "right",
    },
    {
      title: "Damaged",
      dataIndex: "damagedQty",
      key: "damagedQty",
      align: "right",
    },
    {
      title: "Lost",
      dataIndex: "lostQty",
      key: "lostQty",
      align: "right",
    },
    {
      title: "Avg Cost",
      dataIndex: "avgCost",
      key: "avgCost",
      align: "right",
      render: (value: string) => `৳ ${Number(value).toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Overview" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Table */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search products..."
          style={{ width: screens.lg ? 330 : "100%" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>All Stock</Title>

            <Table
              columns={inventoryColumns}
              dataSource={inventories?.data?.data?.data} // <-- your API data array
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          </Card>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Col>
      </Row>
    </div>
  );
}
