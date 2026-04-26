"use client";

import { useEffect, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import SearchableSelect from "@/components/shared/searchable-select";

export default function EditRole() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();
  const swal = useSwal();

  const [permissionIds, setPermissionIds] = useState<number[]>([]);

  /* ================= FETCH ROLE ================= */
  const { data: role } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const res = await api.get(`/roles/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  /* ================= HYDRATE ================= */
  useEffect(() => {
    if (!role) return;

    form.setFieldsValue({
      name: role.name,
      slug: role.slug,
      description: role.description,
    });

    const ids = role.permissions?.map((p: any) => p.id) || [];
    setPermissionIds(ids);
  }, [role, form]);

  /* ================= UPDATE ================= */
  const onFinish = async (values: any) => {
    try {
      await api.patch(`/roles/${id}`, {
        ...values,
        permission_ids: permissionIds,
      });

      swal.success("Role updated");
      router.push("/admin/dashboard/users-permission/roles");
    } catch {
      swal.error("Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Role" breadcrumb={adminBreadcrumb} />

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
            <SearchableSelect
              endpoint="/permissions"
              placeholder="Search permissions"
              mode="multiple"
              value={permissionIds}
              onChange={(v) => setPermissionIds(v as number[])}
              labelKey="label"
              valueKey="id"
            />
          </Form.Item>

          <div className="flex gap-2 items-center">
            <Button type="primary" htmlType="submit">
              Update Role
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
