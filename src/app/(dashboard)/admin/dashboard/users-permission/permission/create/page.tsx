"use client";

import { Card, Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { useSwal } from "@/hooks/use-swal";
import api from "@/lib/axios";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { queryClient } from "@/providers/query-provider";

export default function CreatePermission() {
  const [form] = Form.useForm();
  const router = useRouter();
  const swal = useSwal();

  const onFinish = async (values: any) => {
    try {
      await api.post("/permissions", values);

      swal.success("Permission created");

      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      router.push("/admin/dashboard/users-permission/permission");
    } catch (e: any) {
      swal.error(e?.response?.data?.message || "Failed to create permission");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Permission" breadcrumb={adminBreadcrumb} />

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="module_key"
            label="Module"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. masters" />
          </Form.Item>

          <Form.Item
            name="feature_key"
            label="Feature"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. products" />
          </Form.Item>

          <Form.Item
            name="action_key"
            label="Action"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. create / view / update" />
          </Form.Item>

          <Form.Item name="label" label="Label">
            <Input placeholder="Create product" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="flex gap-2">
            <Button type="primary" htmlType="submit">
              Create
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
