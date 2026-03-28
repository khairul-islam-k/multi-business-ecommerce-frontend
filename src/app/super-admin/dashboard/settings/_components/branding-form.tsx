"use client";

import { Form, Input, Button, message } from "antd";

import  from "@/hooks/use-submit";
import { brandingSchema, BrandingValues } from "../schemas";

export default function BrandingForm() {
  const [form] = Form.useForm<BrandingValues>();
  const { handler } = (async () => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handler(brandingSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Logo URL" name="logo">
        <Input />
      </Form.Item>

      <Form.Item label="Favicon URL" name="favicon">
        <Input />
      </Form.Item>

      <Form.Item label="Invoice Prefix" name="invoicePrefix">
        <Input />
      </Form.Item>

      <Form.Item label="Order Prefix" name="orderPrefix">
        <Input />
      </Form.Item>

      <Button type="primary">Save Branding</Button>
    </Form>
  );
}
