"use client";

import { Card, Col, Row, Select, Tag, Typography } from "antd";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useFinanceTransactionQuery } from "@/lib/api/hooks/finance-account";
import { useAuthStore } from "@/stores/auth.store";

import type { FinanceTransactionResponse } from "@/types/finance/account";

const { Title, Text } = Typography;

const formatMoney = (value?: string | number | null, currency = "BDT") => {
  const amount = Number(value ?? 0);
  return `${currency} ${amount.toLocaleString()}`;
};

const transactionTypeColor: Record<string, string> = {
  CREDIT: "green",
  DEBIT: "red",
};

const referenceTypeLabel: Record<string, string> = {
  MANUAL: "Manual",
  PAYABLE: "Payable",
  RECEIVABLE: "Receivable",
  EXPENSE: "Expense",
  ORDER: "Order",
  REFUND: "Refund",
  OTHER: "Other",
};

const Transactions = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    "CREDIT" | "DEBIT" | undefined
  >();

  const limit = 10;

  const {
    data: transactions,
    isLoading,
    isFetching,
  } = useFinanceTransactionQuery(businessId, id, {
    page: currentPage,
    limit,
  });

  console.log("data", transactions);

  const transactionItems = transactions?.items ?? [];

  const total = transactions?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const creditAmount = transactionItems
    .filter((item) => item.transactionType === "CREDIT")
    .reduce((total, item) => total + Number(item.amount ?? 0), 0);

  const debitAmount = transactionItems
    .filter((item) => item.transactionType === "DEBIT")
    .reduce((total, item) => total + Number(item.amount ?? 0), 0);

  const currentBalance = Number(transactionItems[0]?.balanceAfter ?? 0);

  const columns: Column<FinanceTransactionResponse>[] = [
    {
      key: "transactionNo",
      label: "Transaction No",
      type: "primary",
      render: (row) => <strong>{row.transactionNo}</strong>,
    },
    {
      key: "transactionType",
      label: "Type",
      type: "meta",
      render: (row) => (
        <Tag
          color={transactionTypeColor[row.transactionType]}
          icon={row.transactionType === "CREDIT" ? <ArrowUp /> : <ArrowDown />}
        >
          {row.transactionType}
        </Tag>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <strong>{formatMoney(row.amount)}</strong>,
    },
    {
      key: "balanceBefore",
      label: "Balance Before",
      render: (row) => formatMoney(row.balanceBefore),
    },
    {
      key: "balanceAfter",
      label: "Balance After",
      render: (row) => formatMoney(row.balanceAfter),
    },
    {
      key: "referenceType",
      label: "Reference Type",
      render: (row) =>
        referenceTypeLabel[row.referenceType] ?? row.referenceType,
    },
    {
      key: "note",
      label: "Note",
      render: (row) => row.note || "-",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Transactions"
        subtitle="View account credit, debit, balance, and reference transaction history."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Transactions</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {total}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Credit Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(creditAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Debit Amount</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(debitAmount)}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Current Balance</Text>
            <Title style={{ marginTop: 0 }} level={4}>
              {formatMoney(currentBalance)}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          data={transactionItems}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by type"
                allowClear
                style={{ width: 180 }}
                value={transactionTypeFilter}
                onChange={(value) => {
                  setTransactionTypeFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Credit", value: "CREDIT" },
                  { label: "Debit", value: "DEBIT" },
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
    </div>
  );
};

export default Transactions;
