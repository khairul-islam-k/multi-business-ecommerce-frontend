"use client";

import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Tag,
  Typography,
} from "antd";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinancePayable } from "@/lib/api/hooks/finance-payable-receivable";
import { useAuthStore } from "@/stores/auth.store";

const { Title, Text } = Typography;

const formatMoney = (value?: string | number | null, currency = "BDT") => {
  const amount = Number(value ?? 0);
  return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const partyTypeLabel: Record<string, string> = {
  CUSTOMER: "Customer",
  SUPPLIER: "Supplier",
  COURIER: "Courier",
  PAYMENT_GATEWAY: "Payment Gateway",
  EMPLOYEE: "Employee",
  OTHER: "Other",
};

const sourceTypeLabel: Record<string, string> = {
  ORDER: "Order",
  INVOICE: "Invoice",
  SUPPLIER_INVOICE: "Supplier Invoice",
  SUPPLIER_PAYMENT: "Supplier Payment",
  SUPPLIER_RETURN: "Supplier Return",
  COURIER_RECEIVABLE: "Courier Receivable",
  COURIER_SETTLEMENT: "Courier Settlement",
  EXPENSE: "Expense",
  REFUND: "Refund",
  MANUAL: "Manual",
};

const statusColor: Record<string, string> = {
  PENDING: "orange",
  PARTIALLY_PAID: "blue",
  PAID: "green",
  CANCELLED: "red",
};

const ViewPayablePage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: payable,
    isLoading,
    isFetching,
  } = useFinancePayable(businessId, id);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!payable) {
    return <Empty description="Payable not found" />;
  }

  const totalAmount = Number(payable.totalAmount ?? 0);
  const paidAmount = Number(payable.paidAmount ?? 0);
  const dueAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payable Details"
        subtitle="View payable amount, payment status, source, and party information."
        breadcrumb={adminBreadcrumb}
      />

      <Button icon={<ArrowLeft />} onClick={() => router.back()}>
        Back
      </Button>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={4} className="!mb-1">
              {payable.payableNo}
            </Title>

            <Text type="secondary">
              {partyTypeLabel[payable.partyType] ?? payable.partyType} payable
            </Text>
          </div>

          <Tag color={statusColor[payable.status] ?? "default"}>
            {payable.status}
          </Tag>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Text type="secondary">Total Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(payable.totalAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Text type="secondary">Paid Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(payable.paidAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Text type="secondary">Due Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(dueAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Text type="secondary">Status</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {payable.status}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card title="Payable Information">
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Payable No">
            {payable.payableNo}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={statusColor[payable.status] ?? "default"}>
              {payable.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Party Type">
            {partyTypeLabel[payable.partyType] ?? payable.partyType}
          </Descriptions.Item>

          <Descriptions.Item label="Party ID">
            {payable.partyId}
          </Descriptions.Item>

          <Descriptions.Item label="Source Type">
            {sourceTypeLabel[payable.sourceType] ?? payable.sourceType}
          </Descriptions.Item>

          <Descriptions.Item label="Source ID">
            {payable.sourceId}
          </Descriptions.Item>

          <Descriptions.Item label="Total Amount">
            {formatMoney(payable.totalAmount)}
          </Descriptions.Item>

          <Descriptions.Item label="Paid Amount">
            {formatMoney(payable.paidAmount)}
          </Descriptions.Item>

          <Descriptions.Item label="Due Amount">
            {formatMoney(dueAmount)}
          </Descriptions.Item>

          <Descriptions.Item label="Due Date">
            {formatDate(payable.dueDate)}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDate(payable.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {formatDate(payable.updatedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Note" span={2}>
            {payable.note || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ViewPayablePage;
