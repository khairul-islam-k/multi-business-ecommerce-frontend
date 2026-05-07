"use client";

import { Form, Select, Input, Button } from "antd";

import useSubmit from "@/hooks/use-submit";
import { themeSchema, ThemeValues } from "../schemas";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

export default function ThemeForm() {
  const swal = useSwal();
  const [form] = Form.useForm<ThemeValues>();
  const { handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handler(themeSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Theme Mode" name="theme">
        <Select>
          <Option value="light">Light</Option>
          <Option value="dark">Dark</Option>
          <Option value="system">System</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Primary Color" name="primaryColor">
        <Input type="color" />
      </Form.Item>

      <Button type="primary">Save</Button>
    </Form>
  );
}
