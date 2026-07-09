"use client";

import { Banknote, Eye, Pencil } from "lucide-react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceReceivableQuery } from "@/lib/api/hooks/finance-payable-receivable";
import { useAuthStore } from "@/stores/auth.store";
import { ReceivableResponse, ReceivableStatus } from "@/types/finance/payable";
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
import ReceiveReceivable from "./_components/receivable_form";

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

const statusColor: Record<ReceivableStatus, string> = {
  PENDING: "orange",
  PARTIALLY_RECEIVED: "blue",
  RECEIVED: "green",
  CANCELLED: "red",
};

const ReceivablesPage = () => {
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ReceivableStatus | undefined
  >();

  const [payModalOpen, setPayModalOpen] = useState<boolean>(false);
  const [payableId, setPayableId] = useState<string>("");

  const limit = 10;

  const {
    data: receivables,
    isLoading,
    isFetching,
  } = useFinanceReceivableQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  const total = receivables?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const receivableItems = receivables?.items ?? [];

  const totalAmount = receivableItems.reduce((total, receivable) => {
    return total + Number(receivable.totalAmount ?? 0);
  }, 0);

  const receivedAmount = receivableItems.reduce((total, receivable) => {
    return total + Number(receivable.receivedAmount ?? 0);
  }, 0);

  const dueAmount = totalAmount - receivedAmount;

  const pendingReceivables = receivableItems.filter(
    (receivable) => receivable.status === "PENDING",
  ).length;

  const columns: Column<ReceivableResponse>[] = [
    {
      key: "receivableNo",
      label: "Receivable No",
      type: "primary",
      render: (row) => <strong>{row.receivableNo}</strong>,
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
      key: "receivedAmount",
      label: "Received Amount",
      render: (row) => formatMoney(row.receivedAmount),
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
          <Tooltip title="View receivable">
            <Button
              size="small"
              icon={<Eye />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/finance/receivables/view/${row.id}`,
                )
              }
            />
          </Tooltip>

          {!(row.status === "RECEIVED") && (
            <Tooltip title="Pay receivable">
              <Button
                size="small"
                type="primary"
                icon={<Banknote />}
                onClick={() => {
                  setPayableId(row.id);
                  setPayModalOpen(true);
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
        title="Receivables"
        subtitle="Manage customer, supplier, courier, refund, and manual receivable records."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Receivables</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {total}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Receivable Amount</Text>
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
            <Text type="secondary">Pending Receivables</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {pendingReceivables}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          data={receivableItems}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                showSearch
                allowClear
                placeholder="Filter by status"
                style={{ width: 210 }}
                optionFilterProp="label"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Pending", value: "PENDING" },
                  {
                    label: "Partially Received",
                    value: "PARTIALLY_RECEIVED",
                  },
                  { label: "Received", value: "RECEIVED" },
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
        onCancel={() => {
          setPayModalOpen(false);
          setPayableId("");
        }}
        footer={null}
        destroyOnHidden
      >
        <ReceiveReceivable
          receivableId={payableId}
          receiveModalOpen={setPayModalOpen}
        />
      </Modal>
    </div>
  );
};

export default ReceivablesPage;
