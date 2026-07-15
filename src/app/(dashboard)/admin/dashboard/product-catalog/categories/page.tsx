"use client";

import {
  App,
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  useProductCategoriesMutation,
  useProductCategoriesQuery,
} from "@/lib/api/hooks/product-categories";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseCategory } from "@/types/product/product";

const imageUrlSet = (url: string) => {
  if (url.startsWith("http")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const image = `${baseUrl}${url}`;
  return image;
};

const { Text } = Typography;

const Categories = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const [search, setSearch] = useState<string>("");
  const { message } = App.useApp();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: category,
    isLoading,
    isFetching,
  } = useProductCategoriesQuery(businessId, {
    page: currentPage,
    limit: 10,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  const { removeCategories } = useProductCategoriesMutation(businessId);

  // pagination
  const total = category?.meta?.total || 0;
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeCategories.mutateAsync(id);
      message.success("Category deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<ResponseCategory>[] = [
    {
      key: "imageUrl",
      label: "Image",
      render: (row) =>
        row.imageUrl ? (
          <Image
            src={imageUrlSet(row.imageUrl)}
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
      label: "Name",
      type: "primary",
      render: (row) => (
        <div className="min-w-0">
          <Text
            strong
            className="block max-w-[260px]"
            ellipsis={{ tooltip: row.name }}
          >
            {row.name}
          </Text>
        </div>
      ),
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
      key: "parent",
      label: "Parent",
      type: "secondary",
      render: (row) => row.parent?.name ?? "Root category",
    },
    {
      key: "children",
      label: "Children",
      render: (row) => (
        <Space size={4} wrap>
          <Tag>{row._count?.children ?? row.children?.length ?? 0}</Tag>
          {row.children?.slice(0, 2).map((child) => (
            <Tag key={child.id} color="blue">
              {child.name}
            </Tag>
          ))}
          {(row.children?.length ?? 0) > 2 ? (
            <Tag>+{(row.children?.length ?? 0) - 2}</Tag>
          ) : null}
        </Space>
      ),
    },
    {
      key: "products",
      label: "Products",
      render: (row) => row._count?.products ?? 0,
    },
    {
      key: "createdAt",
      label: "Updated",
      render: (row) =>
        new Date(row.updatedAt ?? row.createdAt).toLocaleDateString(),
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
                `/admin/dashboard/product-catalog/categories/view/${row.id}`,
              )
            }
          ></Button>
          <Button
            size="small"
            icon={<Pencil />}
            onClick={() =>
              router.push(
                `/admin/dashboard/product-catalog/categories/update/${row.id}`,
              )
            }
          ></Button>

          <Popconfirm
            title="Delete category?"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button icon={<Trash2 />} danger size="small"></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Manage product categories, parent-child hierarchy, images, status, and sorting."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={category?.items ?? []}
          toolbarEnd={
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-3">
              <div className="flex gap-3">
                <Select
                  placeholder="Filter by status"
                  allowClear
                  style={{ width: 180 }}
                  onChange={(v) => {
                    setStatusFilter(v);
                    setCurrentPage(1);
                  }}
                  options={[
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                  ]}
                />
              </div>

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push(
                    "/admin/dashboard/product-catalog/categories/create",
                  )
                }
              >
                New Category
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
            totalPages: totalPages,
          }}
        />
      </Card>
    </div>
  );
};

export default Categories;
