"use client";

import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  MenuProps,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CirclePlus,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useFinanceAccountMutation,
  useFinanceAccountQuery,
} from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  AccountStatus,
  AddMoneyPayload,
  FinanceAccountResponse,
} from "@/types/finance/account";

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
  const [form] = Form.useForm<AddMoneyPayload>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | undefined>();

  const limit = 10;

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

  const { removeAccount, addMoney } = useFinanceAccountMutation(businessId);

  const total = accounts?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const accountItems = accounts?.items ?? [];

  const totalBalance = accountItems.reduce((total, account) => {
    return total + Number(account.currentBalance ?? 0);
  }, 0);

  const activeAccounts = accountItems.filter(
    (account) => account.status === "ACTIVE",
  ).length;

  const inactiveAccounts = accountItems.filter(
    (account) => account.status === "INACTIVE",
  ).length;

  const handleDelete = async (id: string) => {
    try {
      await removeAccount.mutateAsync(id);
      swal.success("Account deleted successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  // modal add money
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<string>("");

  const handleFinish = async (values: AddMoneyPayload) => {
    if (!accountId) {
      swal.error("Account id is missing.");
      return;
    }
    setLoading(true);

    try {
      const payload: AddMoneyPayload = {
        amount: values.amount,
        note: values.note?.trim() || undefined,
      };

      const res = await addMoney.mutateAsync({
        accountId,
        payload,
      });

      swal.success("Money added successfully.");

      form.resetFields();
      setModalOpen(false);
      setAccountId("");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
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
      render: (row) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "View account",
            icon: <Eye />,
          },
          {
            key: "edit",
            label: "Update account",
            icon: <Pencil />,
          },
          {
            key: "add-money",
            label: "Add money",
            icon: <CirclePlus />,
          },
          {
            key: "transactions",
            label: "Transactions",
            icon: <WalletCards />,
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Delete account",
            icon: <Trash2 />,
            danger: true,
            disabled: removeAccount.isPending,
          },
        ];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") {
            router.push(`/admin/dashboard/finance/accounts/detail/${row.id}`);
          }

          if (key === "edit") {
            router.push(`/admin/dashboard/finance/accounts/edit/${row.id}`);
          }

          if (key === "add-money") {
            setModalOpen(true);
            setAccountId(row.id);
          }

          if (key === "transactions") {
            router.push(
              `/admin/dashboard/finance/accounts/transactions/${row.id}`,
            );
          }

          if (key === "delete") {
            swal.modal.confirm({
              title: "Delete account?",
              content: "Are you sure you want to delete this account?",
              okText: "Yes",
              cancelText: "No",
              okButtonProps: {
                danger: true,
                loading: removeAccount.isPending,
              },
              onOk: async () => {
                await handleDelete(row.id);
              },
            });
          }
        };

        return (
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Tooltip title="Actions">
              <Button size="small" icon={<MoreHorizontal />}></Button>
            </Tooltip>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        subtitle="Manage cash, bank, mobile banking, payment gateway, and other finance accounts."
        breadcrumb={adminBreadcrumb}
      />

      {/* <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Accounts</Text>
            <Title
              style={{
                marginTop: 0,
              }}
              level={4}
            >
              {total}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Account Balance</Text>
            <Title
              style={{
                marginTop: 0,
              }}
              level={4}
            >
              {formatMoney(totalBalance)}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Active Account</Text>
            <Title
              style={{
                marginTop: 0,
              }}
              level={4}
            >
              {activeAccounts}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Inactive Account</Text>
            <Title
              style={{
                marginTop: 0,
              }}
              level={4}
            >
              {inactiveAccounts}
            </Title>
          </Card>
        </Col>
      </Row> */}

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
                icon={<CirclePlus />}
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

      {/* modal */}
      <Modal
        title="Add Money"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form<AddMoneyPayload>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Amount to add"
            tooltip="Enter the deposit amount in this account's currency."
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter amount",
              },
              {
                validator: (_, value) => {
                  if (typeof value !== "number" || value <= 0) {
                    return Promise.reject("Amount must be greater than 0");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Example: 500"
            />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea rows={3} placeholder="Owner cash deposit" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)} disabled={loading}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={loading}>
              Add Money
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountsList;
