"use client";

import {
  Save
} from "lucide-react";


import { Form, Input, Select, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { generalSettingsSchema, GeneralSettingsValues } from "../schemas";

export default function GeneralSettingsForm() {
  const swal = useSwal();
  const [form] = Form.useForm<GeneralSettingsValues>();

  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        platformName: "OneComm",
        timezone: "UTC",
        currency: "BDT",
      }}
      onFinish={(values) => handler(generalSettingsSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Platform name" name="platformName">
        <Input />
      </Form.Item>

      <Form.Item label="Timezone" name="timezone">
        <Select>
          <option value="UTC">UTC</option>
          <option value="EST">EST</option>
          <option value="PST">PST</option>
          <option value="CET">CET</option>
        </Select>
      </Form.Item>

      <Form.Item label="Currency" name="currency">
        <Select>
          <option value="BDT">BDT</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </Select>
      </Form.Item>

      <Button
        type="primary"
        icon={<Save />}
        htmlType="submit"
        loading={loading}
      >
        Save Changes
      </Button>
    </Form>
  );
}
