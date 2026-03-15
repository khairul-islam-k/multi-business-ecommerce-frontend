"use client";

import { Form, Input, Select, Button, message } from "antd";

import useSubmit from "@/hooks/use-submit";
import { apiKeySchema, ApiKeyValues } from "../schemas";

const { Option } = Select;

export default function ApiKeysForm() {
  const [form] = Form.useForm<ApiKeyValues>();
  const { handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Saved!");
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
          <Option value="orders">Orders</Option>
          <Option value="products">Products</Option>
          <Option value="customers">Customers</Option>
        </Select>
      </Form.Item>

      <Button type="primary">Generate API Key</Button>
    </Form>
  );
}
