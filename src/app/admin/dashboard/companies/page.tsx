"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { mockCompanies } from "./data";
import ViewModal from "./_components/view-modal";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Search } = Input;

export default function CompaniesPage() {
  const router = useRouter();

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredData = mockCompanies.filter((company) => {
    const matchesSearch = company.companyName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus = statusFilter ? company.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await Promise.resolve(() => setTimeout(() => {}, 1000));
    message.success("Category deleted");
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "companyName",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
    },
    {
      title: "Employees",
      dataIndex: "employees",
    },
    {
      title: "Plan",
      dataIndex: "plan",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        if (status === "Active")
          return <Badge status="success" text="Active" />;
        if (status === "Trial") return <Badge status="warning" text="Trial" />;
        return <Badge status="default" text={status} />;
      },
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          {/* View */}
          <Button
            size="small"
            onClick={() => {
              setSelectedCompany(record);
              setIsViewOpen(true);
            }}
            icon={<EyeOutlined />}
          />

          {/* Edit (navigate) */}
          <Button
            size="small"
            onClick={() =>
              router.push(`/admin/dashboard/companies/edit/${record.id}`)
            }
            icon={<EditOutlined />}
          />

          {/* Delete (popup) */}
          <Popconfirm
            title="Delete category?"
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
      <PageHeader title="Companies" breadcrumb={adminBreadcrumb} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-3">
          <Search
            placeholder="Search companies"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
          />

          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setStatusFilter(v)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Trial", value: "Trial" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        {/* Add (navigate) */}
        <Button
          type="primary"
          onClick={() => router.push("/admin/dashboard/companies/create")}
          icon={<PlusOutlined />}
        >
          Add Company
        </Button>
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>List of Companies</Title>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              size="small"
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* View Modal */}
      <ViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        company={selectedCompany}
      />
    </div>
  );
}
