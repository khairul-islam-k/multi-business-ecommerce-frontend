"use client";

import { useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function EditPermission() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const router = useRouter();
  const swal = useSwal();

  const { data: permission } = useQuery({
    queryKey: ["permission", id],
    queryFn: async () => {
      const res = await api.get(`/permissions/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!permission) return;

    form.setFieldsValue({
      module_key: permission.module_key,
      feature_key: permission.feature_key,
      action_key: permission.action_key,
      label: permission.label,
      description: permission.description,
    });
  }, [permission, form]);

  const onFinish = async (values: any) => {
    try {
      await api.patch(`/permissions/${id}`, values);

      swal.success("Permission updated");
      router.push("/admin/dashboard/users-permission/permission");
    } catch (e: any) {
      swal.error(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Permission" breadcrumb={adminBreadcrumb} />

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="module_key"
            label="Module"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="feature_key"
            label="Feature"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="action_key"
            label="Action"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="label" label="Label">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="flex gap-2">
            <Button type="primary" htmlType="submit">
              Update
            </Button>

            <Button
              onClick={() =>
                router.push("/admin/dashboard/users-permission/permission")
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
