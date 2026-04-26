"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, Grid, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { Column, DataTable } from "@/components/shared/data-table";
import Pagination from "@/components/shared/Pagination";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";

interface TUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_by: string;
}

export default function Users() {
  const router = useRouter();
  const swal = useSwal();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     FETCH USERS
  ========================= */
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/users?${params.toString()}`, {});

      return res.data?.data || [];
    },
  });

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns: Column<TUser>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row.email,
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Tag color={row.status === "Active" ? "green" : "red"}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "created_by",
      label: "Created By",
      render: (row) => row.created_by,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Flex gap={8}>
          <Link
            href={`/admin/dashboard/users-permission/users/details/${row.uuid}`}
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
                      `/admin/dashboard/users-permission/users/edit-user/${row.uuid}`,
                    ),
                },
                {
                  key: "delete",
                  label: "Delete",
                  onClick: async () => {
                    const { isConfirmed } = await swal.confirm({
                      title: "Confirm Deletion",
                      text: "Are you sure you want to delete this user?",
                    });
                    if (isConfirmed) {
                      await api.delete(`/users/${row.uuid}`);
                      queryClient.invalidateQueries({ queryKey: ["users"] });
                      swal.success("Deleted successfully");
                    }
                  },
                  danger: true,
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

  return (
    <div className="space-y-6">
      <PageHeader title="Users List" breadcrumb={adminBreadcrumb} />

      <Card>
        <DataTable
          data={data?.data || []}
          toolbarEnd={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push(
                  "/admin/dashboard/users-permission/users/create-user",
                )
              }
            >
              Create User
            </Button>
          }
          columns={columns}
          loading={isLoading || isFetching}
          onSearch={(value) => setSearch(value)}
        />
      </Card>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={data?.meta?.totalPages || 1}
      />
    </div>
  );
}
