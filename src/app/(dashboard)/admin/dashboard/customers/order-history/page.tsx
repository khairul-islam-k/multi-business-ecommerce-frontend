"use client";

import {
  Search
} from "lucide-react";


import { useState } from "react";
import { Card, Flex, Grid, Input, Select, Space } from "antd";

import HistoryTable from "./_components/HistoryTable";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const OrderHistory = () => {
  const screens = Grid.useBreakpoint();
  const [filterProduct, setFilterProduct] = useState<string>("All");
  console.log(filterProduct);

  const handleSearch = (data: string) => {
    console.log("search", data);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Customer Order History"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Track all customer orders</p>

      <Card>
        {/* Search and filter */}
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
              Orders
            </h3>
          </div>

          <Space style={{ marginBottom: 16 }}>
            <Input
              style={{
                width: screens.lg ? "330px" : "100%",
              }}
              prefix={<Search />}
              placeholder="Search packages..."
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Select
              value={filterProduct}
              style={{ width: 140 }}
              onChange={setFilterProduct}
            >
              <option value="All">Status All</option>
              <option value="Delivered">Delivered</option>
              <option value="Shipped">Shipped</option>
              <option value="Processing">Processing</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </Space>
        </Flex>

        <HistoryTable />
      </Card>
    </div>
  );
};

export default OrderHistory;
