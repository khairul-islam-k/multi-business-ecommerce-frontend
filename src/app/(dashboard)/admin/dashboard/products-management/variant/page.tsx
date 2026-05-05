"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Grid, Input, Select } from "antd";
import { useState } from "react";
import VariantHeader from "./components/VariantHeader";
import VariantTable from "./components/VariantTable";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/shared/pagination";

export type TVariant = {
  id: string;
  uuid: string;

  product_id: string;

  sku: string;
  barcode: string | null;
  name: string;

  cost_price: string; // DECIMAL comes as string
  sale_price: string;

  stock_alert_qty: number;

  status: "Active" | "Inactive" | "Deleted" | "Pending" | "Postponed";

  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;

  createdAt: string; // ISO date string
  updatedAt: string;
  deletedAt: string | null;
};

const VariantManagement = () => {
  const screens = Grid.useBreakpoint();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 1000);
  const [statusFilter, setStatusFilter] = useState(null);
  const queryClient = useQueryClient();

  // search
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: variants } = useQuery({
    queryKey: ["products", statusFilter, searchValue, page],
    queryFn: async () => {
      if (statusFilter) {
        return api.get(
          `/variant?search=${searchValue}&status=${statusFilter}&page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=DESC`,
        );
      } else {
        return api.get(
          `/variant?search=${searchValue}&page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=DESC`,
        );
      }
    },
  });

  // pagination
  const total = variants?.data?.data?.meta?.total;
  const totalPages = Math.ceil(total / limit);

  // deleted
  const deleteVariant = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/variant/${id}`);
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

  const handleDelete = (id: string) => {
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
        deleteVariant.mutate(id);
      }
    });
  };

  return (
    <div>
      {/* header */}
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Product Variant Manager"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Manage SKUs, pricing, and stock levels across all product variants.</p>

      {/* <VariantHeader /> */}

      <Card title="All Variants">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex gap-3">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              style={{ width: screens.lg ? 330 : "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 180 }}
              onChange={(v) => setStatusFilter(v)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
                { label: "Deleted", value: "Deleted" },
                { label: "Postponed", value: "Postponed" },
              ]}
            />
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              router.push(
                "/admin/dashboard/products-management/variant/variant-create",
              )
            }
          >
            create variant
          </Button>
        </div>

        {/* Table */}
        <VariantTable
          handleDelete={handleDelete}
          tableData={variants?.data?.data?.data ?? []}
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

export default VariantManagement;
