"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, Modal, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { Column, DataTable } from "@/components/shared/data-table";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";
import SearchableSelect from "@/components/shared/searchable-select";

interface TUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_by: string;
  [key: string]: any;
}

export default function Users() {
  const router = useRouter();
  const swal = useSwal();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  /* =========================
     FETCH USERS
  ========================= */
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/users?${params.toString()}`);
      return res.data?.data || [];
    },
  });

  const setRoles = async (uuid: string, roles: number[]) => {
    try {
      await api.patch(`/users/${uuid}`, { role_ids: roles });
      swal.success("Roles applied successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      swal.error("Failed to apply roles");
    }
  };

  /* =========================
     OPEN MODAL
  ========================= */
  const openRoleModal = (user: TUser) => {
    setSelectedUser(user);
    console.log(user);
    setSelectedRoles(user.roles?.map((role: any) => role?.name) || []);
    setIsRoleModalOpen(true);
  };

  const handleRoleModalOk = async () => {
    if (!selectedUser) return;

    await setRoles(selectedUser.uuid, selectedRoles);
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleRoleModalCancel = () => {
    setIsRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

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
      key: "assignRole",
      label: "Assign Role",
      render: (row) => (
        <Button
          type="default"
          icon={<UserSwitchOutlined />}
          onClick={() => openRoleModal(row)}
        >
          Assign Roles
        </Button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
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
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages: data?.meta?.totalPages || 1,
          }}
        />
      </Card>

      {/* Role Assignment Modal */}
      <Modal
        title={`Assign Roles to ${selectedUser?.name || ""}`}
        open={isRoleModalOpen}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        okText="Apply Roles"
        cancelText="Cancel"
      >
        <SearchableSelect
          value={selectedRoles}
          onChange={(roles) => setSelectedRoles(roles as number[])}
          endpoint="/roles"
          mode="multiple"
          placeholder="Select roles"
        />
      </Modal>
    </div>
  );
}
