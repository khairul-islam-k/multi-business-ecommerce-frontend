"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Card, Dropdown, Empty, Flex, Modal, Select, Tag } from "antd";
import {
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import type { Employee } from "@/lib/api";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useEmployeeMutations, useEmployees, useRoles } from "@/lib/api";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { ApiId } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";

const getEmployeeRoles = (employee: Employee) =>
  employee.roles ?? employee.userRoleMaps?.map((map) => map.role) ?? [];

export default function Users() {
  const router = useRouter();
  const swal = useSwal();
  const businessId = useActiveBusinessId();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<ApiId[]>([]);

  const usersQuery = useEmployees(businessId ?? undefined, {
    search,
    page: currentPage,
    limit: 10,
  });
  const rolesQuery = useRoles(businessId ?? undefined, { limit: 100 });
  const employeeMutations = useEmployeeMutations(businessId ?? "");
  const createAccess = usePermissionAccess(PERMISSIONS.employeeCreate);
  const updateAccess = usePermissionAccess(PERMISSIONS.employeeUpdate);
  const deleteAccess = usePermissionAccess(PERMISSIONS.employeeDelete);
  const roleOptions = useMemo(() => {
    const options = new Map<ApiId, { label: string; value: ApiId }>();

    (rolesQuery.data?.items ?? []).forEach((role) => {
      options.set(role.id, { label: role.name, value: role.id });
    });

    (selectedUser ? getEmployeeRoles(selectedUser) : []).forEach((role) => {
      options.set(role.id, { label: role.name, value: role.id });
    });

    return Array.from(options.values());
  }, [rolesQuery.data?.items, selectedUser]);

  const openRoleModal = (user: Employee) => {
    setSelectedUser(user);
    setSelectedRoles(getEmployeeRoles(user).map((role) => role.id));
    setIsRoleModalOpen(true);
  };

  const handleRoleModalOk = async () => {
    if (!businessId || !selectedUser) return;

    try {
      await employeeMutations.replaceEmployeeRoles.mutateAsync({
        employeeId: selectedUser.id,
        payload: { roleIds: selectedRoles },
      });
      swal.success("Roles applied successfully.");
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status ?? "ACTIVE"}
        </Tag>
      ),
    },
    {
      key: "roles",
      label: "Roles",
      render: (row) =>
        getEmployeeRoles(row).length ? (
          <Flex wrap gap={4}>
            {getEmployeeRoles(row).map((role) => (
              <Tag key={role.id}>{role.name}</Tag>
            ))}
          </Flex>
        ) : (
          "-"
        ),
    },
    {
      key: "assignRole",
      label: "Assign Role",
      render: (row) =>
        updateAccess.allowed ? (
          <Button
            type="default"
            icon={<UserSwitchOutlined />}
            onClick={() => openRoleModal(row)}
          >
            Assign Roles
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage staff accounts, statuses, and role assignments for the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={usersQuery.data?.items ?? []}
          toolbarEnd={
            createAccess.allowed ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push(
                    "/admin/dashboard/access-control/employees/create",
                  )
                }
              >
                Create Employee
              </Button>
            ) : null
          }
          columns={columns}
          loading={
            usersQuery.isLoading ||
            usersQuery.isFetching ||
            employeeMutations.removeEmployee.isPending
          }
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages: usersQuery.data?.meta.totalPages || 1,
          }}
          actions={(row) => (
            <Flex gap={8}>
              <Link
                href={`/admin/dashboard/access-control/employees/details/${row.id}`}
              >
                <Button type="text" icon={<EyeOutlined />} />
              </Link>

              {(updateAccess.allowed || deleteAccess.allowed) && (
                <Dropdown
                  menu={{
                    items: [
                      updateAccess.allowed
                        ? {
                            key: "edit",
                            label: "Edit",
                            onClick: () =>
                              router.push(
                                `/admin/dashboard/access-control/employees/edit/${row.id}`,
                              ),
                          }
                        : null,
                      deleteAccess.allowed
                        ? {
                            key: "delete",
                            label: "Delete",
                            danger: true,
                            onClick: async () => {
                              const { isConfirmed } = await swal.confirm({
                                title: "Confirm Deletion",
                                text: "Are you sure you want to delete this employee?",
                              });

                              if (!isConfirmed) return;

                              await employeeMutations.removeEmployee.mutateAsync(
                                row.id,
                              );
                              swal.success("Deleted successfully.");
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              )}
            </Flex>
          )}
        />
      </Card>

      <Modal
        title={`Assign roles to ${selectedUser?.name || ""}`}
        open={isRoleModalOpen}
        onOk={handleRoleModalOk}
        onCancel={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
          setSelectedRoles([]);
        }}
        okText="Apply Roles"
        cancelText="Cancel"
        confirmLoading={employeeMutations.replaceEmployeeRoles.isPending}
      >
        <Select
          mode="multiple"
          showSearch
          className="w-full"
          placeholder="Select roles"
          value={selectedRoles}
          loading={rolesQuery.isLoading}
          onChange={setSelectedRoles}
          optionFilterProp="label"
          options={roleOptions}
        />
      </Modal>
    </div>
  );
}
