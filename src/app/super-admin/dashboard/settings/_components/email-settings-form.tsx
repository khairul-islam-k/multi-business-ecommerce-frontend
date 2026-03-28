"use client";

import { Form, Input, Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import  from "@/hooks/use-submit";
import { emailSettingsSchema, EmailSettingsValues } from "../schemas";

export default function EmailSettingsForm() {
  const [form] = Form.useForm<EmailSettingsValues>();
  const { loading, handler } = (async () => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        host: "smtp.example.com",
        port: 587,
        sender: "noreply@platform.com",
        username: "smtp-user",
        password: "",
      }}
      onFinish={(values) => handler(emailSettingsSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item label="SMTP Host" name="host">
        <Input />
      </Form.Item>

      <Form.Item label="Port" name="port">
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Sender Email" name="sender">
        <Input />
      </Form.Item>

      <Form.Item label="SMTP Username" name="username">
        <Input />
      </Form.Item>

      <Form.Item label="SMTP Password" name="password">
        <Input.Password />
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
