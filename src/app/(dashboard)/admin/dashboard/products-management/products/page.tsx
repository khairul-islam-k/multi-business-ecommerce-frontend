"use client";

import { DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import Pagination from "@/components/shared/pagination";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import {
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Dropdown, Flex, Grid, Input, Select, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  const screens = Grid.useBreakpoint();
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ===== STATE ===== */
  const [page, setPage] = useState(1);
  const limit = 5;

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  /* ===== DEBOUNCE SEARCH ===== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1); // reset page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  /* ===== FETCH DATA ===== */
  const { data: Products } = useQuery({
    queryKey: ["products", page, limit, debouncedSearch, statusFilter],
    queryFn: async () => {
      if (statusFilter) {
        return api.get(
          `/products?search=${debouncedSearch}&status=${statusFilter}&page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=DESC`,
        );
      } else {
        return api.get(
          `/products?search=${debouncedSearch}&page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=DESC`,
        );
      }
    },
  });

  // delete
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/products/${id}`);
    },

    onSuccess: () => {
      // refresh product list after delete
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // pagination
  const total = Products?.data?.data?.meta?.total;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = (deleteId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct.mutate(deleteId);
      }
    });
  };

  /* ===== TABLE COLUMNS ===== */
  const productColumns = [
    { label: "Name", key: "name" },
    { label: "Cost Price", key: "cost_price" },
    { label: "Sale Price", key: "sale_price" },
    { label: "Compare Price", key: "compare_price" },
    {
      label: "Status",
      key: "status",
      render: (record: TProduct) => (
        <Tag color={record.status === "Active" ? "green" : "red"}>
          {record.status}
        </Tag>
      ),
    },
    {
      label: "Featured",
      key: "is_featured",
      render: (record: TProduct) => (record.is_featured ? "Yes" : "No"),
    },
    { label: "Published At", key: "published_at" },
    {
      label: "",
      key: "",
      render: (record: TProduct) => (
        <Flex>
          <Link
            href={`/admin/dashboard/products-management/products/detail/${record.uuid}`}
          >
            <Button type="text" icon={<EyeOutlined />} />
          </Link>

          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit",
                  onClick: () =>
                    router.push(
                      `/admin/dashboard/products-management/products/edit/${record.uuid}`,
                    ),
                },
                {
                  key: "delete",
                  danger: true,
                  label: "Delete",
                  onClick: () => {
                    handleDelete(record.uuid);
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Flex>
      ),
    },
  ];

  /* ================= UI ================= */
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Products List" breadcrumb={adminBreadcrumb} />

      {/* 🔍 Search + Add Button */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex gap-3">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search products..."
            style={{ width: screens.lg ? 330 : "100%" }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setStatusFilter(v)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            router.push("/admin/dashboard/products-management/products/create")
          }
        >
          New Product
        </Button>
      </div>

      {/* 🔄 Search / Pagination Loader */}
      <Card>
        <DataTable
          data={Products?.data?.data?.data ?? []}
          columns={productColumns}
        />
      </Card>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ProductsList;
