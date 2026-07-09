"use client";

import { App, Button, Card, Empty, Form, Input, Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useRole, useRoleMutations } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";

import PermissionTree from "../../_components/permission-tree";

import type { PermissionItem } from "@/lib/api";
type EditRoleValues = {
  name: string;
  description?: string;
  status?: string;
};

export default function EditRole() {
  const [form] = Form.useForm<EditRoleValues>();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { message } = App.useApp();
  const businessId = useActiveBusinessId();
  const roleId = id;
  const roleQuery = useRole(businessId ?? undefined, roleId);
  const { updateRole } = useRoleMutations(businessId ?? "");

  const [permissions, setPermissions] = useState<PermissionItem[] | null>(null);
  const selectedPermissions = permissions ?? roleQuery.data?.permissions ?? [];

  useEffect(() => {
    const role = roleQuery.data;
    if (!role) return;

    form.setFieldsValue({
      name: role.name,
      description: role.description ?? undefined,
      status: role.status,
    });
  }, [roleQuery.data, form]);

  const onFinish = async (values: EditRoleValues) => {
    if (!businessId) return;

    try {
      await updateRole.mutateAsync({
        roleId,
        payload: {
          ...values,
          permissions: selectedPermissions,
        },
      });

      message.success("Role updated successfully.");
      router.push("/admin/dashboard/access-control/roles");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (roleQuery.isLoading) {
    return (
      <Loader
        label="Loading role"
        description="Fetching role details and selected permissions."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Role"
        subtitle="Update role details and the permissions assigned to it."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Permissions">
            <PermissionTree
              value={selectedPermissions}
              onChange={setPermissions}
            />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={updateRole.isPending}
            >
              Update Role
            </Button>
            <Button
              htmlType="button"
              onClick={() =>
                router.push("/admin/dashboard/access-control/roles")
              }
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
