"use client";
import { useRouter } from "next/navigation";
import { Button, Card, Dropdown, MenuProps, Popconfirm, Select, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined
} from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useProductMutation, useProductsQuery } from "@/lib/api/hooks/product";
import Image from "next/image";
import { Column, DataTable } from "@/components/shared/data-table";
import { ProductStatus, ResponseProduct } from "@/types/product/product";
import { imageUrlSet } from "./_components/image-url";
import { getApiErrorMessage } from "@/lib/axios";

/* ================= TYPES ================= */
export interface TProduct {
  id: string;
  uuid: string;
  name: string;
  status: "Active" | "Inactive" | "Deleted";
  is_featured: boolean;
  sale_price: number | null;
  compare_price: number | null;
  cost_price: number | null;
  published_at: string | null;
}

/* ================= COMPONENT ================= */
const ProductsList = () => {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<ProductStatus | undefined>();
  const [sortBy, setSortBy] = useState<"name" | "price" | "createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const swal = useSwal();

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [search, setSearch] = useState('');
  const limit = 5;

  const { data: products, isLoading, isFetching } = useProductsQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortBy,
    sortOrder,
  });

  const { removeProduct } = useProductMutation(businessId);

  // pagination
  const total = products?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeProduct.mutateAsync(id);
      swal.success('Product has been deleted');
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  }

  // create attribute

  const columns: Column<ResponseProduct>[] = [
    {
      key: "images",
      label: "Image",
      render: (row) => {
        const image = row.images?.[0];

        return image?.imageUrl ? (
          <Image
            src={imageUrlSet(image.imageUrl)}
            alt={image.altText || row.name}
            width={48}
            height={48}
            className="rounded-md object-cover"
            unoptimized
          />
        ) : (
          "-"
        );
      },
    },
    {
      key: "name",
      label: "Product Name",
      type: "primary",
      render: (row) => (
        <div>
          <strong>{row.name}</strong>
          <p className="m-0 text-xs text-gray-500">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category?.name ?? "-",
    },
    {
      key: "brand",
      label: "Brand",
      render: (row) => row.brand?.name ?? "-",
    },
    {
      key: "unit",
      label: "Unit",
      render: (row) => row.unit?.name ?? "-",
    },
    {
      key: "tags",
      label: "Tags",
      render: (row) =>
        row.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {row.tags.map((item) => (
              <Tag key={item.id}>{item.tag?.name ?? "-"}</Tag>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => {
        const color =
          row.status === "ACTIVE"
            ? "green"
            : row.status === "DRAFT"
              ? "blue"
              : row.status === "ARCHIVED"
                ? "default"
                : "red";

        return <Tag color={color}>{row.status}</Tag>;
      },
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
            key: "delete",
            danger: true,
            icon: <DeleteOutlined />,
            label: (
              <Popconfirm
                title="Delete product?"
                description="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete(row.id)}
              >
                <span>Delete</span>
              </Popconfirm>
            ),
          },
        ];

        return (
          <Dropdown
            // trigger={["click"]}
            placement="bottomRight"
            menu={{
              items,
              onClick: ({ key }) => {
                if (key === "view") {
                  router.push(
                    `/admin/dashboard/product-catalog/products/detail/${row.id}`
                  );
                }

                if (key === "edit") {
                  router.push(
                    `/admin/dashboard/product-catalog/products/edit/${row.id}`
                  );
                }
              },
            }}
          >
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  /* ================= UI ================= */
  return (
    <div className='space-y-6'>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog, images, categories, brands, units, tags, and product status."
        breadcrumb={adminBreadcrumb}
      />

      {/* 🔄 Search / Pagination Loader */}
      <Card>
        <DataTable
          data={products?.items ?? []}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "DRAFT", value: "DRAFT" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                  { label: "Archived", value: "ARCHIVED" },
                ]}
              />

              <Select
                value={sortBy}
                style={{ width: 160 }}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Sort: Created", value: "createdAt" },
                  { label: "Sort: Updated", value: "updatedAt" },
                  { label: "Sort: Name", value: "name" },
                  { label: "Sort: Price", value: "price" },
                ]}
              />

              <Select
                value={sortOrder}
                style={{ width: 120 }}
                onChange={(value) => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Desc", value: "desc" },
                  { label: "Asc", value: "asc" },
                ]}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push("/admin/dashboard/product-catalog/products/create")
                }
              >
                New Product
              </Button>
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={
            isLoading ||
            isFetching
          }
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

export default ProductsList;
