"use client";

import { useState } from "react";
import { Card, Grid, Input, Select } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import CustomerCard from "./_components/CustomerCard";
import PageHeader from "@/components/shared/page-header";
import CustomersTable from "./_components/CustomersTable";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const CustomerList = () => {
  const screens = Grid.useBreakpoint();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <PageHeader title="Customers" breadcrumb={adminBreadcrumb}></PageHeader>
      </div>

      <p>Manage your customer base</p>

      <CustomerCard />

      <Card title="All Customers">
        {/* search variant */}
        <div
          //  className="flex overflow-auto gap-2 mb-4"
          style={{
            display: "flex",
            flexWrap: screens.xs ? "wrap" : "initial",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Input
            placeholder="Filter by name or email..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: 280 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={statusFilter}
            style={{ width: 140 }}
            onChange={setStatusFilter}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </Select>

          <Select
            value={sourceFilter}
            style={{ width: 140 }}
            onChange={setSourceFilter}
          >
            <option value="All">All Sources</option>
            <option value="Website">Website</option>
            <option value="Facebook">Facebook</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Instagram">Instagram</option>
            <option value="Google Adds">Google Adds</option>
            <option value="Referral">Referral</option>
          </Select>
        </div>

        {/* Table */}
        <CustomersTable />
      </Card>
    </div>
  );
};

export default CustomerList;
