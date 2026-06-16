"use client";

import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, MenuProps, Popconfirm, Select, Tag, Tooltip } from "antd";
import { useRouter } from "next/navigation";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import { useCustomerMutation, useCustomerQuery } from "@/lib/api/hooks/customer";
import { useAuthStore } from "@/stores/auth.store";
import CustomerCard from "./_components/CustomerCard";
import { CustomerResponse, CustomerStatus } from "@/types/customer/customer";
import { useSwal } from "@/hooks/use-swal";

const getStatusColor = (status: CustomerStatus) => {
  if (status === "ACTIVE") return "green";
  if (status === "BLOCKED") return "red";
  return "orange";
};

const CustomerList = () => {
  const router = useRouter();
  const swal = useSwal();

  const [statusFilter, setStatusFilter] = useState<CustomerStatus | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const limit = 10;

  const {
    data: customers,
    isLoading,
    isFetching,
  } = useCustomerQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  const { removeCustomer } = useCustomerMutation(businessId);

  const total = customers?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = (id: string) => {
    swal.modal.confirm({
      title: "Delete customer?",
      content: "Are you sure you want to delete this customer?",
      okText: "Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeCustomer.mutateAsync(id);
          swal.success("Customer deleted successfully");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<CustomerResponse>[] = [
    {
      key: "name",
      label: "Customer Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row.email ?? "-",
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getStatusColor(row.status)}>{row.status}</Tag>
      ),
    },
    {
      key: "_count",
      label: "Orders",
      render: (row) => row._count?.orders ?? 0,
    },
    {
      key: "carts",
      label: "Carts",
      render: (row) => row._count?.carts ?? 0,
    },
    {
      key: "addresses",
      label: "Addresses",
      render: (row) => row.addresses?.length ?? 0,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "View",
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
          },
          {
            key: "add-address",
            icon: <EnvironmentOutlined />,
            label: "Add Address",
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            danger: true,
          },
        ];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") {
            router.push(
              `/admin/dashboard/customers/customer-list/details/${row.id}`
            );
          }

          if (key === "edit") {
            router.push(
              `/admin/dashboard/customers/customer-list/update/${row.id}`
            );
          }

          if (key === "add-address") {
            router.push(
              `/admin/dashboard/customers/customer-list/address/${row.id}`
            );
          }

          if (key === "delete") {
            handleDelete(row.id);
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
              <Button
                size="small"
                icon={<MoreOutlined />}
                onClick={(e) => e.preventDefault()}
              />
            </Tooltip>
          </Dropdown>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage customer information, contact details, status, orders, carts, and addresses."
        breadcrumb={adminBreadcrumb}
      />

      <CustomerCard />

      <Card>
        <DataTable
          data={customers?.items ?? []}
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                  { label: "Blocked", value: "BLOCKED" },
                ]}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push("/admin/dashboard/customers/customer-list/create")
                }
              >
                New Customer
              </Button>
            </div>
          }
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

export default CustomerList;