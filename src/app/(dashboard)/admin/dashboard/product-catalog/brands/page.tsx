"use client";

import { App, Button, Card, Popconfirm, Select, Tag } from "antd";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  useBrandMutation,
  useProductBrandQuery,
} from "@/lib/api/hooks/product-brand";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseBrand } from "@/types/product/brands";

const imageUrlSet = (url: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const image = `${baseUrl}${url}`;
  return image;
};

const ProductBrands = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { message } = App.useApp();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const {
    data: brands,
    isLoading,
    isFetching,
  } = useProductBrandQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  const { removeBrand } = useBrandMutation(businessId);

  // pagination
  const total = brands?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeBrand.mutateAsync(id);
      message.success("Deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<ResponseBrand>[] = [
    {
      key: "logoUrl",
      label: "Logo",
      render: (row) =>
        row.logoUrl ? (
          <Image
            src={imageUrlSet(row.logoUrl)}
            alt={row.name}
            width={48}
            height={48}
            className="rounded-md object-cover"
            unoptimized
          />
        ) : (
          "-"
        ),
    },
    {
      key: "name",
      label: "Brand Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
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
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<Eye />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/brands/view/${row.id}`,
              )
            }
          />

          <Button
            size="small"
            icon={<Pencil />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/brands/update/${row.id}`,
              )
            }
          />

          <Popconfirm
            title="Delete brand?"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger size="small" icon={<Trash2 />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Brands"
        subtitle="Manage product brands, logos, status, sorting, and product usage."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={brands?.items ?? []}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                onChange={(v) => setStatusFilter(v)}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push("/admin/dashboard/product-catalog/brands/create")
                }
              >
                New Brand
              </Button>
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages: totalPages,
          }}
        />
      </Card>
    </div>
  );
};

export default ProductBrands;
