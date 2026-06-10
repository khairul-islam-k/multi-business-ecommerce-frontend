"use client";
import { Column, DataTable } from "@/components/shared/data-table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  useFinanceAccountMutation,
  useFinanceAccountQuery,
} from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { AccountStatus, FinanceAccountResponse } from "@/types/finance/account";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Title, Text } = Typography;

const formatMoney = (value?: string | number | null, currency = "BDT") => {
  const amount = Number(value ?? 0);
  return `${currency} ${amount.toLocaleString()}`;
};

const accountTypeLabel: Record<string, string> = {
  CASH: "Cash",
  BANK: "Bank",
  MOBILE_BANKING: "Mobile Banking",
  PAYMENT_GATEWAY: "Payment Gateway",
  OTHER: "Other",
};

const AccountsList = () => {
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | undefined>();

  const limit = 5;

  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useFinanceAccountQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  const { removeAccount } = useFinanceAccountMutation(businessId);

  const total = accounts?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const accountItems = accounts?.items ?? [];

  const totalBalance = accountItems.reduce((total, account) => {
    return total + Number(account.currentBalance ?? 0);
  }, 0);

  const activeAccounts = accountItems.filter(
    (account) => account.status === "ACTIVE"
  ).length;

  const inactiveAccounts = accountItems.filter(
    (account) => account.status === "INACTIVE"
  ).length;

  const handleDelete = async (id: string) => {
    try {
      await removeAccount.mutateAsync(id);
      swal.success("Account deleted successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<FinanceAccountResponse>[] = [
    {
      key: "name",
      label: "Account Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "accountType",
      label: "Account Type",
      render: (row) => accountTypeLabel[row.accountType] ?? row.accountType,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      render: (row) => row.accountNumber,
    },
    {
      key: "currentBalance",
      label: "Current Balance",
      render: (row) => (
        <strong>{formatMoney(row.currentBalance, row.currencyCode)}</strong>
      ),
    },
    {
      key: "openingBalance",
      label: "Opening Balance",
      render: (row) => formatMoney(row.openingBalance, row.currencyCode),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View account">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/accounts/detail/${row.id}`)
              }
            />
          </Tooltip>

          <Tooltip title="Update account">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/accounts/edit/${row.id}`)
              }
            />
          </Tooltip>

          <Tooltip title="Delete account">
            <Popconfirm
              title="Delete account?"
              description="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(row.id)}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
              loading={removeAccount.isPending}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Manage cash, bank, mobile banking, payment gateway, and other finance accounts."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text
            type="secondary">Total Accounts</Text>
            <Title
            style={{
              marginTop: 0
            }}
            level={4}>{total}</Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Account Balance</Text>
            <Title
            style={{
              marginTop: 0
            }}
            level={4}>{formatMoney(totalBalance)}</Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Active Account</Text>
            <Title
            style={{
              marginTop: 0
            }}
            level={4}>{activeAccounts}</Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Inactive Account</Text>
            <Title
            style={{
              marginTop: 0
            }}
            level={4}>{inactiveAccounts}</Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          data={accountItems}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                showSearch
                allowClear
                placeholder="Filter by status"
                style={{ width: 180 }}
                optionFilterProp="label"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push("/admin/dashboard/finance/accounts/create")
                }
              >
                Create Account
              </Button>
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

export default AccountsList;