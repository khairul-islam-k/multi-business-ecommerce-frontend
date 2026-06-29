"use client";

import {
  Save
} from "lucide-react";


import { Form, Switch, Button } from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import {
  notificationSettingsSchema,
  NotificationSettingsValues,
} from "../schemas";

export default function NotificationSettingsForm() {
  const swal = useSwal();
  const [form] = Form.useForm<NotificationSettingsValues>();

  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Saved!");
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        orderEmail: true,
        orderSMS: true,
        marketingEmail: false,
        systemAlerts: true,
      }}
      onFinish={(values) => handler(notificationSettingsSchema.parse(values))}
      className="max-w-lg"
    >
      <Form.Item
        label="Order Email Notifications"
        name="orderEmail"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Order SMS Notifications"
        name="orderSMS"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="Marketing Emails"
        name="marketingEmail"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label="System Alerts"
        name="systemAlerts"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Button
        type="primary"
        icon={<Save />}
        htmlType="submit"
        loading={loading}
      >
        Save
      </Button>
    </Form>
  );
}
