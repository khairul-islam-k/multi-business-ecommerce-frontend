"use client";

import { Form, Input, Select, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { apiKeySchema, ApiKeyValues } from "../schemas";

export default function ApiKeysForm() {
  const swal = useSwal();
  const [form] = Form.useForm<ApiKeyValues>();

  const { handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handler(apiKeySchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Key Name" name="keyName">
        <Input />
      </Form.Item>

      <Form.Item label="Permissions" name="permissions">
        <Select mode="multiple">
          <option value="orders">Orders</option>
          <option value="products">Products</option>
          <option value="customers">Customers</option>
        </Select>
      </Form.Item>

      <Button type="primary">Generate API Key</Button>
    </Form>
  );
}
