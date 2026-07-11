"use client";

import {
  CirclePlus,
  MoreHorizontal,
  Pencil,
  ShoppingBag,
  Trash2
} from "lucide-react";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Dropdown, MenuProps, Popconfirm, Select, Tag, Tooltip } from "antd";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import {
  useSupplierMutation,
  useSuppliersQuery,
} from "@/lib/api/hooks/supplier";
import { useAuthStore } from "@/stores/auth.store";
import { SupplierResponse, SupplierStatus } from "@/types/suppliers/supplier";

const SupplierInfo = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [statusFilter, setStatusFilter] = useState<SupplierStatus | undefined>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const {
    data: suppliers,
    isLoading,
    isFetching,
  } = useSuppliersQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  const { removeSupplier } = useSupplierMutation(businessId);

  const total = suppliers?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeSupplier.mutateAsync(id);
      message.success("Supplier deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<SupplierResponse>[] = [
    {
      key: "name",
      label: "Supplier Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "companyName",
      label: "Company",
      render: (row) => row.companyName || "-",
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row.email || "-",
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "city",
      label: "City",
      render: (row) => row.city || "-",
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
      key: "_count",
      label: "Products",
      render: (row) => row._count?.products ?? 0,
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
            key: "view-products",
            icon: <ShoppingBag />,
            label: "View Supplier Products",
          },
          {
            key: "add-supplier-product",
            icon: <CirclePlus />,
            label: "Add Supplier Product",
          },
          {
            key: "edit",
            icon: <Pencil />,
            label: "Edit",
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            icon: <Trash2 />,
            label: "Delete",
            danger: true,
          },
        ];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view-products") {
            router.push(`/admin/dashboard/suppliers/supplier/product/${row.id}`);
          }

          if (key === "add-supplier-product") {
            router.push(
              `/admin/dashboard/suppliers/supplier/add-supplier-product/${row.id}`
            );
          }

          if (key === "edit") {
            router.push(`/admin/dashboard/suppliers/supplier/edit/${row.id}`);
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
                icon={<MoreHorizontal />}
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
        title="Suppliers"
        subtitle="Manage suppliers, company details, contact information, and product usage."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={suppliers?.items ?? []}
          columns={columns}
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
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push("/admin/dashboard/suppliers/supplier/create")
                }
              >
                New Supplier
              </Button>
            </div>
          }
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

export default SupplierInfo;