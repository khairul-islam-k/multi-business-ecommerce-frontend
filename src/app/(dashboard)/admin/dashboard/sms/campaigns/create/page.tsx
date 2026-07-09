"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  theme,
} from "antd";
import { useRouter } from "next/navigation";

export default function CreateCampaign() {
  const swal = useSwal();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { handler, loading } = useSubmit(async () => {
    swal.success("Campaign created successfully");
    router.push("/admin/dashboard/sms/campaigns");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Campaign" breadcrumb={adminBreadcrumb} />

      <div
        style={{
          backgroundColor: token.colorBgBase,
          width: "100%",
          padding: 24,
        }}
      >
        <Card
          title="Campaign Details"
          className="max-w-2xl"
          style={{ marginInline: "auto" }}
        >
          <Form layout="vertical" form={form} onFinish={handler}>
            <Form.Item
              label="Campaign Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Summer Sale 2024" />
            </Form.Item>

            <Form.Item
              label="Target Audience"
              name="target"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "All Customers", value: "all_customers" },
                  { label: "Segment", value: "segment" },
                  { label: "Manual List", value: "manual" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Schedule (optional)" name="schedule">
              <DatePicker showTime className="w-full" />
            </Form.Item>

            <div className="flex gap-3">
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Campaign
              </Button>
              <Button
                onClick={() => router.push("/admin/dashboard/sms/campaigns")}
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
