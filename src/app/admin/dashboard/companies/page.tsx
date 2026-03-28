"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Search } = Input;

export default function CompaniesPage() {
  const router = useRouter();

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // Mock Data (no owner + added description)
  const mockCompanies = [
    {
      id: "CMP-1001",
      companyName: "TechNova Solutions",
      industry: "Software",
      employees: "120",
      plan: "Pro",
      status: "Active",
      description: "A SaaS company building modern cloud solutions.",
    },
    {
      id: "CMP-1002",
      companyName: "GreenFields Agro",
      industry: "Agriculture",
      employees: "85",
      plan: "Basic",
      status: "Trial",
      description: "Focused on sustainable agriculture and farming tech.",
    },
    {
      id: "CMP-1003",
      companyName: "UrbanBuild Co.",
      industry: "Construction",
      employees: "230",
      plan: "Enterprise",
      status: "Active",
      description: "Large scale infrastructure and urban development.",
    },
    {
      id: "CMP-1004",
      companyName: "HealthFirst",
      industry: "Healthcare",
      employees: "150",
      plan: "Pro",
      status: "Inactive",
      description: "Private healthcare services and clinics.",
    },
    {
      id: "CMP-1005",
      companyName: "EduSmart",
      industry: "Education",
      employees: "60",
      plan: "Basic",
      status: "Trial",
      description: "EdTech platform for online learning.",
    },
  ];

  // Filtering logic
  const filteredData = mockCompanies.filter((company) => {
    const matchesSearch = company.companyName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus = statusFilter ? company.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Columns
  const companiesColumns = [
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
    },
    {
      title: "Employees",
      dataIndex: "employees",
      key: "employees",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "Active")
          return <Badge status="success" text="Active" />;

        if (status === "Trial")
          return <Badge status="processing" text="Trial" />;

        return <Badge status="default" text={status} />;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelectedCompany(record);
              setIsModalOpen(true);
            }}
          >
            View
          </Button>

          <Button
            size="small"
            type="link"
            onClick={() =>
              router.push(`/admin/dashboard/companies/edit?id=${record.id}`)
            }
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" breadcrumb={adminBreadcrumb} />

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Search + Filter */}
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

        {/* Right: Add Button */}
        <Button
          type="primary"
          onClick={() => router.push("/admin/dashboard/companies/add")}
        >
          + Add Company
        </Button>
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>List of Companies</Title>

            <Table
              columns={companiesColumns}
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

      {/* ✅ View Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Company Details"
      >
        {selectedCompany && (
          <Space direction="vertical">
            <Text strong>{selectedCompany.companyName}</Text>
            <Text type="secondary">{selectedCompany.industry}</Text>
            <Text>{selectedCompany.description}</Text>
          </Space>
        )}
      </Modal>
    </div>
  );
}
