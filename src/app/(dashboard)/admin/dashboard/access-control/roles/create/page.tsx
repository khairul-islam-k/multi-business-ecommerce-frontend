"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Empty, Form, Input, Select } from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import type { PermissionItem } from "@/lib/api";
import { useRoleMutations } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import PermissionTree from "../_components/permission-tree";

type CreateRoleValues = {
  name: string;
  description?: string;
  status?: string;
};

export default function CreateRole() {
  const [form] = Form.useForm<CreateRoleValues>();
  const router = useRouter();
  const { message } = App.useApp();
  const businessId = useActiveBusinessId();
  const { createRole } = useRoleMutations(businessId ?? "");

  const [permissions, setPermissions] = useState<PermissionItem[]>([]);

  const onFinish = async (values: CreateRoleValues) => {
    if (!businessId) return;

    try {
      await createRole.mutateAsync({
        name: values.name,
        description: values.description,
        status: values.status,
        permissions,
      });

      message.success("Role created successfully.");
      router.push("/admin/dashboard/access-control/roles");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Role"
        subtitle="Create a permission bundle that can be assigned to employees."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "ACTIVE" }}
        >
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
            <PermissionTree value={permissions} onChange={setPermissions} />
          </Form.Item>

          <div className="flex gap-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={createRole.isPending}
            >
              Create Role
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
