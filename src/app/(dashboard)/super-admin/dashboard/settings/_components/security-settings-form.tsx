"use client";

import {
  Save
} from "lucide-react";


import { Form, Input, Select, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { securitySettingsSchema, SecuritySettingsValues } from "../schemas";

export default function SecuritySettingsForm() {
  const swal = useSwal();
  const [form] = Form.useForm<SecuritySettingsValues>();

  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        sessionTimeout: 30,
        passwordLength: 8,
        passwordStrength: "strong",
      }}
      onFinish={(values) => handler(securitySettingsSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="Session Timeout (minutes)" name="sessionTimeout">
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Minimum Password Length" name="passwordLength">
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Password Strength" name="passwordStrength">
        <Select>
          <option value="basic">Basic</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
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
