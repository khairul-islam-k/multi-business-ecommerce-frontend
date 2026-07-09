"use client";

import { Form, Input, Select, Button } from "antd";

import useSubmit from "@/hooks/use-submit";
import { webhookSchema, WebhookValues } from "../schemas";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

export default function WebhooksForm() {
  const swal = useSwal();
  const [form] = Form.useForm<WebhookValues>();
  const { handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handler(webhookSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Event" name="eventName">
        <Select>
          <Option value="order.created">Order Created</Option>
          <Option value="order.updated">Order Updated</Option>
          <Option value="order.delivered">Order Delivered</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Target URL" name="targetUrl">
        <Input />
      </Form.Item>

      <Form.Item label="Secret Key" name="secret">
        <Input.Password />
      </Form.Item>

      <Button type="primary">Save Webhook</Button>
    </Form>
  );
}
