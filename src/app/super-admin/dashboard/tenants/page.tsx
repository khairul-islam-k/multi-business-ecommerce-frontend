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
  Typography,
  Upload,
  Flex,
  InputNumber,
  theme,
} from "antd";

import { MoreOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import PageHeader from "@/components/shared/page-header";
import { mockTenants } from "@/components/demoData/mockData";

const { Option } = Select;

export default function TenantListPage() {
  const router = useRouter();
  const [msgApi, contextHolder] = message.useMessage();

  // file upload
  const [fileName, setFileName] = useState<string>("");
  console.log(fileName);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
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

  const handleCreate = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCreating(false);
    setShowCreate(false);
    msgApi.success("Tenant created successfully");
  };

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

  const {token} = theme.useToken();

  return (
    <>
      {contextHolder}

      <div style={{ marginBottom: '10px' }}>
        <PageHeader title="Tenants">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowCreate(true)}
          >
            Create Tenant
          </Button>
        </PageHeader>
      </div>

      <Card>
        {/* Filters */}
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

      {/* Create Tenant Modal */}
      <Modal
        title="Create New Tenant"
        open={showCreate}
        onCancel={() => setShowCreate(false)}
        onOk={handleCreate}
        confirmLoading={creating}
      >
        <Typography.Title style={{ marginTop: "8px" }} level={5}>Business Name</Typography.Title>
        <Input placeholder="Business name" className="mb-2" />

        <Typography.Title style={{ marginTop: "8px" }} level={5}>Slug</Typography.Title>
        <Input placeholder="Slug" className="mb-2" />

        <Typography.Title style={{ marginTop: "8px" }} level={5}>Email</Typography.Title>
        <Input placeholder="Email" className="mb-2" />

        <Typography.Title style={{ marginTop: "8px" }} level={5}>Phone</Typography.Title>
        <Input placeholder="+880156415" />

        <Typography.Title style={{ marginTop: "8px" }} level={5}>Logo</Typography.Title>
        <Upload
          style={{ width: "100%" }}
          accept=".pdf,.jpg,.png"
          beforeUpload={(file) => {
            if (file.size / 1024 / 1024 > 2) {
              message.error("File must be under 2MB");
              return Upload.LIST_IGNORE;
            }
            setFileName(file.name);
            return false;
          }}
          showUploadList={false}
        >
          <Input
            placeholder="Upload your file"
            value={fileName}
            readOnly
            suffix={<UploadOutlined />}
          />
        </Upload>

        <Flex gap={16}>
          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ marginTop: 8 }}>
              Status
            </Typography.Title>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Trial">Trial</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>
          </div>

          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ marginTop: 8 }}>
              Trial duration (days)
            </Typography.Title>
            <InputNumber style={{ width: '100%' }} defaultValue={999} />
          </div>
        </Flex>

        <Flex gap={16}>
          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ marginTop: 8 }}>
              Currency
            </Typography.Title>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="bdt">BDT</Option>
              <Option value="usd">USD</Option>
              <Option value="eur">EUR</Option>
            </Select>
          </div>

          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ marginTop: 8 }}>
              TimeZone
            </Typography.Title>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="utc">UTC</Option>
              <Option value="est">EST</Option>
              <Option value="pst">PST</Option>
            </Select>
          </div>
        </Flex>

      </Modal>

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
