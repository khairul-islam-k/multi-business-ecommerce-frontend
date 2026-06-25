"use client";

import {
  Eye
} from "lucide-react";


import { useMemo, useState } from "react";
import { Button, Card, Select, Space, Tag } from "antd";
import Link from "next/link";

import { Column, DataTable } from "@/components/shared/data-table";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useSuppliersQuery } from "@/lib/api/hooks/supplier";
import { useAllSupplierProductsQuery } from "@/lib/api/hooks/supplier-product";
import {
  CommonStatus,
  SupplierProductResponse,
} from "@/types/suppliers/supplier-product";

const money = (value?: string | number | null) =>
  `BDT ${Number(value ?? 0).toLocaleString()}`;

export default function SupplierProductsTable() {
  const businessId = useActiveBusinessId() ?? "";
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CommonStatus | undefined>();
  const [supplierId, setSupplierId] = useState<string | undefined>();
  const limit = 10;

  const query = useMemo(
    () => ({
      page: currentPage,
      limit,
      search,
      status,
      supplierId,
    }),
    [currentPage, search, status, supplierId],
  );

  const supplierProducts = useAllSupplierProductsQuery(businessId, query);
  const suppliers = useSuppliersQuery(businessId, { page: 1, limit: 100 });

  const columns: Column<SupplierProductResponse>[] = [
    {
      key: "product",
      label: "Product",
      type: "primary",
      render: (row) => (
        <div>
          <strong>{row.product.name}</strong>
          <p className="m-0 text-xs text-gray-500">
            {row.variant?.title ?? "No variant"}
          </p>
        </div>
      ),
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (row) => row.supplier.name,
    },
    {
      key: "supplierSku",
      label: "Supplier SKU",
      render: (row) => row.supplierProduct.supplierSku ?? "-",
    },
    {
      key: "lastPurchasePrice",
      label: "Last Price",
      render: (row) => money(row.supplierProduct.lastPurchasePrice),
    },
    {
      key: "leadTimeDays",
      label: "Lead Time",
      render: (row) =>
        row.supplierProduct.leadTimeDays == null
          ? "-"
          : `${row.supplierProduct.leadTimeDays} days`,
    },
    {
      key: "minOrderQuantity",
      label: "Min Qty",
      render: (row) => row.supplierProduct.minOrderQuantity ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.supplierProduct.status === "ACTIVE" ? "green" : "red"}>
          {row.supplierProduct.status}
        </Tag>
      ),
    },
  ];

  return (
    <Card>
      <DataTable
        data={supplierProducts.data?.items ?? []}
        columns={columns}
        loading={supplierProducts.isLoading || supplierProducts.isFetching}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        extra={
          <Space wrap>
            <Select
              allowClear
              showSearch
              placeholder="Supplier"
              optionFilterProp="label"
              value={supplierId}
              style={{ width: 220 }}
              loading={suppliers.isLoading}
              onChange={(value) => {
                setSupplierId(value);
                setCurrentPage(1);
              }}
              options={(suppliers.data?.items ?? []).map((supplier) => ({
                label: supplier.name,
                value: supplier.id,
              }))}
            />
            <Select
              allowClear
              placeholder="Status"
              value={status}
              style={{ width: 150 }}
              onChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </Space>
        }
        actions={(row) => (
          <Link
            href={`/admin/dashboard/suppliers/supplier/product/${row.supplier.id}`}
          >
            <Button type="text" icon={<Eye />} />
          </Link>
        )}
        pagination={{
          currentPage,
          onPageChange: setCurrentPage,
          totalPages: supplierProducts.data?.meta.totalPages ?? 1,
        }}
      />
    </Card>
  );
}
