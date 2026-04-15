"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  message,
  Flex,
  Space,
  Tooltip,
  Popconfirm,
  theme,
} from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  StopOutlined,
} from "@ant-design/icons";

import { mockTenants } from "./data";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
// import { DataTable } from "@/components/shared/data-table";

const { Option } = Select;

export default function TenantListPage() {
  const router = useRouter();
  const { token } = theme.useToken();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");

  const filtered = mockTenants.filter((t) => {
    const matchSearch =
      !search ||
      t.business.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPkg = packageFilter === "all" || t.package === packageFilter;

    return matchSearch && matchStatus && matchPkg;
  });

  const handleSuspend = async (record: any) => {
    await Promise.resolve();
    message.warning(`${record.business} suspended`);
  };

  const columns = [
    {
      label: "Business Name",
      key: "business",
      render: (record: any) => (
        <Link
          href={`/super-admin/dashboard/tenants/${record.id}`}
          className={`text-[${token.colorTextBase}]!`}
        >
          {record.business}
        </Link>
      ),
    },
    {
      label: "Owner",
      key: "owner",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Package",
      key: "package",
      render: (pkg: any) => <Tag>{pkg}</Tag>,
    },
    {
      label: "Status",
      key: "status",
      render: (status: any) => (
        <Tag
          style={{
            background:
              status === "Active"
                ? token.colorSuccess
                : status === "Trial"
                  ? token.colorWarning
                  : token.colorError,
            color: "white",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      label: "Created",
      key: "created",
    },
    {
      label: "Actions",
      width: 90,
      render: (record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/tenants/${record.id}`)
              }
            />
          </Tooltip>

          <Popconfirm
            title="Suspend tenant?"
            description="This will restrict access"
            onConfirm={() => handleSuspend(record)}
          >
            <Tooltip title="Suspend">
              <Button size="small" danger icon={<StopOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tenants" breadcrumb={superAdminBreadcrumb} />

      {/* <DataTable columns={columns} data={mockTenants} /> */}

      <Card>
        {/* Filters */}
        <Flex justify="space-between" wrap="wrap">
          <div className="flex flex-wrap gap-2 mb-4">
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
              <Option value="all">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Trial">Trial</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>

            <Select
              value={packageFilter}
              style={{ width: 140 }}
              onChange={setPackageFilter}
            >
              <Option value="all">All Packages</Option>
              <Option value="Starter">Starter</Option>
              <Option value="Growth">Growth</Option>
              <Option value="Enterprise">Enterprise</Option>
            </Select>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/super-admin/dashboard/tenants/create")}
          >
            Create Tenant
          </Button>
        </Flex>

        {/* Table */}
        <div style={{ overflowX: "auto", overflowY: "hidden" }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
