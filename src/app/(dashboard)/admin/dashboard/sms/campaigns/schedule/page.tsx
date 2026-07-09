"use client";

import {
  Calendar,
  Clock
} from "lucide-react";


import dayjs from "dayjs";
import PageHeader from "@/components/shared/page-header";
import { Card, Form, Select, DatePicker, Button, message, theme } from "antd";

import { mockCampaigns } from "../data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";

export default function ScheduleCampaign() {
  const swal = useSwal();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { handler, loading } = useSubmit(async () => {
    swal.success("Campaign scheduled!");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Schedule Campaign" breadcrumb={adminBreadcrumb} />

      <div
        style={{
          backgroundColor: token.colorBgBase,
          padding: 24,
        }}
      >
        <Card
          title={
            <span className="flex items-center gap-2">
              <Calendar /> Schedule Settings
            </span>
          }
          className="max-w-2xl"
          style={{
            marginInline: "auto",
          }}
        >
          <Form layout="vertical" form={form} onFinish={handler}>
            <Form.Item
              label="Select Campaign"
              name="campaign"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Choose a campaign"
                options={mockCampaigns
                  .filter((c) => c.status === "draft")
                  .map((c) => ({ label: c.name, value: c.id }))}
              />
            </Form.Item>

            <Form.Item
              label="Schedule Date & Time"
              name="datetime"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                className="w-full"
                format="YYYY-MM-DD HH:mm"
                disabledDate={(d) => d && d < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item
              label="Timezone"
              name="timezone"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select timezone"
                options={[
                  { label: "UTC", value: "UTC" },
                  { label: "Eastern (EST)", value: "EST" },
                  { label: "Pacific (PST)", value: "PST" },
                  { label: "Central (CST)", value: "CST" },
                ]}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<Clock />}
              block
              loading={loading}
            >
              Schedule Campaign
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
