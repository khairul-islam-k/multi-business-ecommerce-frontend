"use client";

import { Form, Select, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { languageSchema, LanguageValues } from "../schemas";

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
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </Select>
      </Form.Item>

      <Form.Item label="Date Format" name="dateFormat">
        <Select>
          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
          <option value="MM-DD-YYYY">MM-DD-YYYY</option>
        </Select>
      </Form.Item>

      <Button type="primary">Save</Button>
    </Form>
  );
}
