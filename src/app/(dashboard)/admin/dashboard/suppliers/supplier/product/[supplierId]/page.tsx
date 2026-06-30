"use client";

import { Button, Card, Select, Tag, Tooltip } from "antd";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useSupplierProductMutation,
  useSupplierProductsQuery,
} from "@/lib/api/hooks/supplier-product";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  CommonStatus,
  SupplierProductResponse,
} from "@/types/suppliers/supplier-product";

const getStatusColor = (status: CommonStatus) => {
  return status === "ACTIVE" ? "green" : "red";
};

const formatMoney = (value?: string | null) => {
  if (!value) return "-";
  return Number(value).toLocaleString();
};

const SupplierProducts = () => {
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { supplierId } = useParams<{ supplierId: string }>();

  const [statusFilter, setStatusFilter] = useState<CommonStatus | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const limit = 10;

  const {
    data: products,
    isLoading,
    isFetching,
  } = useSupplierProductsQuery(businessId, supplierId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  console.log("data", products);

  const total = products?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const { removeSupplierProduct } = useSupplierProductMutation(businessId);

  const handleDelete = (id: string) => {
    swal.modal.confirm({
      title: "Delete supplier product?",
      content: "Are you sure you want to delete this supplier product?",
      okText: "Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeSupplierProduct.mutateAsync({
            supplierId,
            productMId: id,
          });
          swal.success("Supplier product deleted successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<SupplierProductResponse>[] = [
    {
      key: "product",
      label: "Product",
      type: "primary",
      render: (row) => <strong>{row.product?.name ?? "-"}</strong>,
    },
    {
      key: "variant",
      label: "Variant",
      render: (row) => row.variant?.title ?? "-",
    },
    {
      key: "barcode",
      label: "Barcode",
      render: (row) => row.variant?.barcode ?? row.product?.barcode ?? "-",
    },
    {
      key: "lastPurchasePrice",
      label: "Last Purchase Price",
      render: (row) => formatMoney(row.supplierProduct?.lastPurchasePrice),
    },
    {
      key: "minOrderQuantity",
      label: "Min Order Qty",
      render: (row) => row.supplierProduct?.minOrderQuantity ?? "-",
    },
    {
      key: "leadTimeDays",
      label: "Lead Time",
      render: (row) =>
        row.supplierProduct?.leadTimeDays
          ? `${row.supplierProduct.leadTimeDays} days`
          : "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getStatusColor(row.supplierProduct.status)}>
          {row.supplierProduct.status}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) =>
        new Date(row.supplierProduct.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit supplier">
            <Button
              size="small"
              icon={<Pencil />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/suppliers/supplier/update-s-product/${supplierId}/${row?.supplierProduct?.id}`,
                )
              }
            />
          </Tooltip>

          <Tooltip title="Delete supplier">
            <Button
              danger
              size="small"
              icon={<Trash2 />}
              onClick={() => handleDelete(row?.supplierProduct?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Products"
        subtitle="Manage supplier mapped products, variants, purchase price, order quantity, lead time, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={products?.items ?? []}
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
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push(
                    `/admin/dashboard/suppliers/supplier/${supplierId}/products/create`,
                  )
                }
              >
                Add Product
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

export default SupplierProducts;
