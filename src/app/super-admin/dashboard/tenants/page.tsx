"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Dropdown,
  Modal,
  message,
  Flex,
  theme,
} from "antd";

import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import PageHeader from "@/components/shared/page-header";
import { mockTenants } from "@/components/demoData/mockData";

const { Option } = Select;

export default function TenantListPage() {
  const router = useRouter();
  const [msgApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [suspendConfirm, setSuspendConfirm] = useState<string | null>(null);


  const filtered = mockTenants.filter((t) => {
    const matchSearch =
      !search ||
      t.business.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPkg = packageFilter === "all" || t.package === packageFilter;

    return matchSearch && matchStatus && matchPkg;
  });


  const columns = [
    {
      title: "Business Name",
      dataIndex: "business",
      key: "business",
      render: (_: any, record: any) => (
        <a onClick={() => router.push(`/super-admin/dashboard/tenants/${record.id}`)}>
          {record.business}
        </a>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Package",
      dataIndex: "package",
      render: (pkg: string) => <Tag>{pkg}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag
          style={{
            background: status === "Active" ? "#21c45d"
              : status === "Trial" ? '#f4f4f5' : '#ef4444'
          }}
          color={
            status === "Active"
              ? "white"
              : status === "Trial"
                ? "blue"
                : "white"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                onClick: () =>
                  router.push(`/super-admin/dashboard/tenants/${record.id}`),
              },
              {
                key: "suspend",
                label: "Suspend Tenant",
                danger: true,
                onClick: () =>
                  setSuspendConfirm(record.business),
              },
            ],
          }}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const { token } = theme.useToken();

  return (
    <>
      {contextHolder}

      <div style={{ marginBottom: '10px' }}>
        <PageHeader title="Tenants">
        </PageHeader>
      </div>

      <Card>
        {/* Filters */}
        <Flex 
        justify="space-between"
         wrap="wrap"
        >
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
            onClick={() => router.push('/super-admin/dashboard/tenants/create')}
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

      {/* Suspend Confirmation */}
      <Modal
        title="Confirm Suspension"
        open={!!suspendConfirm}
        onCancel={() => setSuspendConfirm(null)}
        onOk={() => {
          msgApi.warning(`${suspendConfirm} suspended`);
          setSuspendConfirm(null);
        }}
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to suspend <strong>{suspendConfirm}</strong>?
      </Modal>
    </>
  );
}
