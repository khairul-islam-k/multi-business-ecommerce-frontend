"use client";

import { Form, Input, Select, Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import useSubmit from "@/hooks/use-submit";
import { securitySettingsSchema, SecuritySettingsValues } from "../schemas";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

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
          <Option value="basic">Basic</Option>
          <Option value="medium">Medium</Option>
          <Option value="strong">Strong</Option>
        </Select>
      </Form.Item>

      <Button
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        loading={loading}
      >
        Save Changes
      </Button>
    </Form>
  );
}
