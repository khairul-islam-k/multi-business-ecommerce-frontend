"use client";

import { Banknote, Eye } from "lucide-react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useFinancePayableQuery } from "@/lib/api/hooks/finance-payable-receivable";
import { useAuthStore } from "@/stores/auth.store";
import { PayableResponse, PayableStatus } from "@/types/finance/payable";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PayPayable from "./_components/pay-payable";

const { Title, Text } = Typography;

const formatMoney = (value?: string | number | null, currency = "BDT") => {
  const amount = Number(value ?? 0);
  return `${currency} ${amount.toLocaleString()}`;
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

const statusColor: Record<PayableStatus, string> = {
  PENDING: "orange",
  PARTIALLY_PAID: "blue",
  PAID: "green",
  CANCELLED: "red",
};

const PayablePage = () => {
  const router = useRouter();
  const swal = useSwal();
  // modal confirm
  const [payModalOpen, setPayModalOpen] = useState<boolean>(false);
  const [payableId, setPayableId] = useState<string>("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayableStatus | undefined>();

  const limit = 10;

  const {
    data: payables,
    isLoading,
    isFetching,
  } = useFinancePayableQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  const total = payables?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const payableItems = payables?.items ?? [];

  const totalAmount = payableItems.reduce((total, payable) => {
    return total + Number(payable.totalAmount ?? 0);
  }, 0);

  const paidAmount = payableItems.reduce((total, payable) => {
    return total + Number(payable.paidAmount ?? 0);
  }, 0);

  const dueAmount = totalAmount - paidAmount;

  const pendingPayables = payableItems.filter(
    (payable) => payable.status === "PENDING",
  ).length;

  const columns: Column<PayableResponse>[] = [
    {
      key: "payableNo",
      label: "Payable No",
      type: "primary",
      render: (row) => <strong>{row.payableNo}</strong>,
    },
    {
      key: "partyType",
      label: "Party Type",
      render: (row) => partyTypeLabel[row.partyType] ?? row.partyType,
    },
    {
      key: "sourceType",
      label: "Source Type",
      render: (row) => sourceTypeLabel[row.sourceType] ?? row.sourceType,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (row) => <strong>{formatMoney(row.totalAmount)}</strong>,
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      render: (row) => formatMoney(row.paidAmount),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => <Tag color={statusColor[row.status]}>{row.status}</Tag>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View payable">
            <Button
              size="small"
              icon={<Eye />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/payables/view/${row.id}`)
              }
            />
          </Tooltip>

          {!(row.status === "PAID") && (
            <Tooltip title="Pay payable">
              <Button
                size="small"
                type="primary"
                icon={<Banknote />}
                onClick={() => {
                  setPayModalOpen(true);
                  setPayableId(row.id);
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payables"
        subtitle="Manage supplier, courier, employee, expense, and manual payable records."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Payables</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {total}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(totalAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Due Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(dueAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Pending Payables</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {pendingPayables}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          data={payableItems}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                showSearch
                allowClear
                placeholder="Filter by status"
                style={{ width: 190 }}
                optionFilterProp="label"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Pending", value: "PENDING" },
                  { label: "Partially Paid", value: "PARTIALLY_PAID" },
                  { label: "Paid", value: "PAID" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
              />
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages,
          }}
        />
      </Card>

      <Modal
        title="Pay Payable"
        open={payModalOpen}
        onCancel={() => setPayModalOpen(false)}
        okText="Pay Now"
        footer={null}
        destroyOnHidden
      >
        <PayPayable payableId={payableId} payModalOpen={setPayModalOpen} />
      </Modal>
    </div>
  );
};

export default PayablePage;
