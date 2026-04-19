"use client";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Column, DataTable } from "@/components/shared/data-table";
import Link from "next/link";
import { Button, message, Popconfirm, Space } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Loader from "@/components/shared/loader";
import { queryClient } from "@/providers/query-provider";
import { useSwal } from "@/hooks/use-swal";

export default function TenantListPage() {
  const swal = useSwal();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["fetch-tenants"],
    queryFn: async () => api.get("/auth-tenant").then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "business_name",
      label: "Business",
      type: "primary",
      sortable: true,
    },

    {
      key: "status",
      label: "Status",
      sortable: true,
      filterOptions: ["Active", "Inactive", "Suspended"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            r.status === "Active"
              ? "bg-green-100 text-green-700"
              : r.status === "Suspended"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {r.status}
        </span>
      ),
    },

    {
      key: "phone",
      label: "Phone",
    },

    {
      key: "email",
      label: "Email",
      render: (r) => r.email ?? "—",
    },

    {
      key: "owner_name",
      label: "Owner",
      render: (r) => r.owner?.name ?? "—",
    },

    {
      key: "currency",
      label: "Currency",
      render: (r) => r.currency ?? "—",
    },

    {
      key: "timezone",
      label: "Timezone",
      render: (r) => r.timezone ?? "—",
    },

    {
      key: "trial_ends_at",
      label: "Trial Ends",
      render: (r) =>
        r.trial_ends_at ? new Date(r.trial_ends_at).toLocaleDateString() : "—",
    },

    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/auth-tenant/${uuid}`);
    swal.success("Tenant delete successfully.");
    queryClient.invalidateQueries({ queryKey: ["fetch-tenants"] });
  };

  const tenants = data.data;

  return (
    <div className="space-y-6">
      <PageHeader title="Tenants" breadcrumb={superAdminBreadcrumb} />

      <DataTable
        data={tenants}
        columns={columns}
        loading={isLoading}
        searchKeys={["business_name", "email", "phone", "status", "owner_name"]}
        toolbarEnd={
          <Link href="/super-admin/dashboard/tenants/create">
            <Button type="primary">Create Tenant</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/tenants/${row.uuid}`)
              }
            />
            <Popconfirm
              title="Delete this item?"
              description="Are you sure you want to delete this record?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(row.uuid)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )}
      />
    </div>
  );
}
