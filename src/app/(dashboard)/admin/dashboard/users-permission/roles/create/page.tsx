"use client";

import { useMemo, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { useSwal } from "@/hooks/use-swal";
import api from "@/lib/axios";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { queryClient } from "@/providers/query-provider";
import SearchableSelect from "@/components/shared/searchable-select";
import PermissionTree from "../_components/permission-tree";

export default function CreateRole() {
  const [form] = Form.useForm();
  const router = useRouter();
  const swal = useSwal();

  const [permissions, setPermissions] = useState<number[]>([]);

  const assignablePermissionIds = useMemo(() => {
    const treePermissions = permissions.filter((p) => !Number.isNaN(Number(p)));
    return [...new Set([...treePermissions])];
  }, [permissions]);

  const onFinish = async (values: any) => {
    try {
      await api.post("/roles", {
        ...values,
        permission_ids: assignablePermissionIds,
      });

      swal.success("Role created");

      queryClient.invalidateQueries({ queryKey: ["roles"] });
      router.push("/admin/dashboard/users-permission/roles");
    } catch {
      swal.error("Failed to create role");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Role" breadcrumb={adminBreadcrumb} />

      <Card className="w-full">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Permissions">
            <PermissionTree value={permissions} onChange={setPermissions} />
          </Form.Item>

          <Form.Item label="Permissions">
            <SearchableSelect
              endpoint="/permissions"
              placeholder="Search permissions"
              mode="multiple"
              value={permissions}
              onChange={(v) => setPermissions(v as number[])}
              labelKey="label"
              valueKey="id"
            />
          </Form.Item>

          <div className="flex gap-2 items-center">
            <Button type="primary" htmlType="submit">
              Create Role
            </Button>
            <Button
              type="default"
              htmlType="button"
              onClick={() =>
                router.push("/admin/dashboard/users-permission/roles")
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
