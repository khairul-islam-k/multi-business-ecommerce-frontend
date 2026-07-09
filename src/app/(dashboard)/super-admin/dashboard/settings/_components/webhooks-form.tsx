"use client";

import { Form, Input, Select, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { webhookSchema, WebhookValues } from "../schemas";

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
          <option value="order.created">Order Created</option>
          <option value="order.updated">Order Updated</option>
          <option value="order.delivered">Order Delivered</option>
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
