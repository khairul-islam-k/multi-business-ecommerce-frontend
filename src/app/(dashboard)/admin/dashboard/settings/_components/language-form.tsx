"use client";

import { Form, Select, Button } from "antd";

import useSubmit from "@/hooks/use-submit";
import { languageSchema, LanguageValues } from "../schemas";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

export default function LanguageForm() {
  const swal = useSwal();
  const [form] = Form.useForm<LanguageValues>();
  const { handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handler(languageSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Language" name="language">
        <Select>
          <Option value="en">English</Option>
          <Option value="bn">Bangla</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Date Format" name="dateFormat">
        <Select>
          <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
          <Option value="MM-DD-YYYY">MM-DD-YYYY</Option>
        </Select>
      </Form.Item>

      <Button type="primary">Save</Button>
    </Form>
  );
}
