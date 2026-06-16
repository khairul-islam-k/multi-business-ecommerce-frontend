"use client";

import React from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

import { useExpense } from "@/lib/api/hooks/expense";
import { useAuthStore } from "@/stores/auth.store";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { ExpenseResponse, ExpenseStatus } from "@/types/stock/expense";

const { Title, Text } = Typography;

const getStatusColor = (status?: ExpenseStatus) => {
  if (status === "PAID") return "green";
  if (status === "CANCELLED") return "red";
  return "orange";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const formatAmount = (amount?: string, currency = "BDT") => {
  if (!amount) return "-";

  return `${currency} ${Number(amount).toLocaleString()}`;
};

const ViewExpense = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: expense, isLoading } = useExpense(businessId, id);

  const item = expense as ExpenseResponse | undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Expense Details"
          subtitle="View expense information."
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Expense Details"
          subtitle="View expense information."
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Empty description="Expense not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Details"
        subtitle="View expense information, account, category, amount, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {item.title}
            </Title>

            <Space wrap>
              <Text type="secondary">{item.expenseNo}</Text>

              <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
            </Space>
          </div>

          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/admin/dashboard/finance/expenses")}
            >
              Back
            </Button>

            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/expenses/update/${item.id}`)
              }
            >
              Edit
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Expense Information" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Expense No">
                  {item.expenseNo}
                </Descriptions.Item>

                <Descriptions.Item label="Title">{item.title}</Descriptions.Item>

                <Descriptions.Item label="Amount">
                  <strong>
                    {formatAmount(item.amount, item.account?.currencyCode)}
                  </strong>
                </Descriptions.Item>

                <Descriptions.Item label="Expense Date">
                  {formatDate(item.expenseDate)}
                </Descriptions.Item>

                <Descriptions.Item label="Reference No">
                  {item.referenceNo ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Note">
                  {item.note ?? "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Account Information" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Account Name">
                  {item.account?.name ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Account Number">
                  {item.account?.accountNumber ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Account Type">
                  {item.account?.accountType ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Currency">
                  {item.account?.currencyCode ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Opening Balance">
                  {formatAmount(
                    item.account?.openingBalance,
                    item.account?.currencyCode
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Current Balance">
                  {formatAmount(
                    item.account?.currentBalance,
                    item.account?.currencyCode
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Account Status">
                  <Tag
                    color={item.account?.status === "ACTIVE" ? "green" : "red"}
                  >
                    {item.account?.status ?? "-"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Category Information" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Category Name">
                  {item.category?.name ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Description">
                  {item.category?.description ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Category Status">
                  <Tag
                    color={item.category?.status === "ACTIVE" ? "green" : "red"}
                  >
                    {item.category?.status ?? "-"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="System Information" size="small">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Created At">
                  {formatDateTime(item.createdAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                  {formatDateTime(item.updatedAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Created By">
                  {item.createdBy}
                </Descriptions.Item>

                <Descriptions.Item label="Deleted At">
                  {formatDateTime(item.deletedAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ViewExpense;