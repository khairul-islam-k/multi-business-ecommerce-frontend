"use client";

import { Card, Form, Input, Select, Button, theme } from "antd";
import { useRouter } from "next/navigation";

import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

export default function CreateSmsTemplate() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const swal = useSwal();

  const { handler, loading } = useSubmit(async () => {
    swal.success("Template created successfully");
    router.push("/admin/dashboard/sms/templates");
  });

  return (
    <div className={`space-y-6`}>
      <PageHeader title="Create SMS Template" breadcrumb={adminBreadcrumb} />

      <div
        style={{
          backgroundColor: token.colorBgBase,
          width: "100%",
          padding: 24,
        }}
      >
        <Card className="max-w-2xl" style={{ marginInline: "auto" }}>
          <Form layout="vertical" form={form} onFinish={handler}>
            <Form.Item
              label="Template Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Welcome Message" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select category"
                options={[
                  "Promotional",
                  "Transactional",
                  "Notification",
                  "Alert",
                ].map((c) => ({ label: c, value: c }))}
              />
            </Form.Item>

            <Form.Item
              label="Message Content"
              name="content"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Hi {{name}}, your message here..."
              />
            </Form.Item>

            <p className="text-xs text-gray-400 mb-4">
              Use {"{{name}}"}, {"{{code}}"} for dynamic fields
            </p>

            <div className="flex gap-3">
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Template
              </Button>
              <Button
                onClick={() => router.push("/admin/dashboard/sms/templates")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
