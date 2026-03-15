"use client";

import { z } from "zod";
import {
  SettingOutlined,
  SafetyOutlined,
  MailOutlined,
  SaveOutlined,
  BellOutlined,
  ApiOutlined,
  LinkOutlined,
  BgColorsOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import { Card, Form, Input, Select, Button, Tabs, message, Switch } from "antd";

import PageHeader from "@/components/shared/page-header";
import useSubmit from "@/hooks/use-submit";

const { Option } = Select;

/* ---------------- schemas ---------------- */

export const generalSettingsSchema = z.object({
  platformName: z.string().min(1),
  timezone: z.string(),
  currency: z.string(),
});

export const securitySettingsSchema = z.object({
  sessionTimeout: z.number().min(5),
  passwordLength: z.number().min(6),
  passwordStrength: z.enum(["basic", "medium", "strong"]),
});

export const notificationSettingsSchema = z.object({
  orderEmail: z.boolean(),
  orderSMS: z.boolean(),
  marketingEmail: z.boolean(),
  systemAlerts: z.boolean(),
});

export const apiKeySchema = z.object({
  keyName: z.string(),
  permissions: z.array(z.string()),
});

export const webhookSchema = z.object({
  eventName: z.string(),
  targetUrl: z.string().url(),
  secret: z.string(),
});

export const brandingSchema = z.object({
  logo: z.string().optional(),
  favicon: z.string().optional(),
  invoicePrefix: z.string(),
  orderPrefix: z.string(),
});

export const languageSchema = z.object({
  language: z.enum(["en", "bn"]),
  dateFormat: z.enum(["DD-MM-YYYY", "MM-DD-YYYY"]),
});

export const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  primaryColor: z.string(),
});

export const emailSettingsSchema = z.object({
  host: z.string(),
  port: z.number(),
  sender: z.string().email(),
  username: z.string(),
  password: z.string(),
});

/* ---------------- types ---------------- */

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
type ApiKeyValues = z.infer<typeof apiKeySchema>;
type WebhookValues = z.infer<typeof webhookSchema>;
type BrandingValues = z.infer<typeof brandingSchema>;
type LanguageValues = z.infer<typeof languageSchema>;
type ThemeValues = z.infer<typeof themeSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;

export default function SettingsPage() {
  const [generalForm] = Form.useForm<GeneralSettingsValues>();
  const [securityForm] = Form.useForm<SecuritySettingsValues>();
  const [notificationForm] = Form.useForm<NotificationSettingsValues>();
  const [apiForm] = Form.useForm<ApiKeyValues>();
  const [webhookForm] = Form.useForm<WebhookValues>();
  const [brandingForm] = Form.useForm<BrandingValues>();
  const [languageForm] = Form.useForm<LanguageValues>();
  const [themeForm] = Form.useForm<ThemeValues>();
  const [emailForm] = Form.useForm<EmailSettingsValues>();

  const { loading, handler } = useSubmit(async () => {
    message.success("Settings saved successfully");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" />

      <Card>
        <Tabs
          defaultActiveKey="general"
          items={[
            /* ---------------- General ---------------- */

            {
              key: "general",
              label: (
                <>
                  <SettingOutlined /> General
                </>
              ),
              children: (
                <Form
                  form={generalForm}
                  layout="vertical"
                  initialValues={{
                    platformName: "OneComm",
                    timezone: "UTC",
                    currency: "BDT",
                  }}
                  onFinish={(values) =>
                    handler(generalSettingsSchema.parse(values))
                  }
                  className="max-w-lg"
                >
                  <Form.Item label="Platform name" name="platformName">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Timezone" name="timezone">
                    <Select>
                      <Option value="UTC">UTC</Option>
                      <Option value="EST">EST</Option>
                      <Option value="PST">PST</Option>
                      <Option value="CET">CET</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Currency" name="currency">
                    <Select>
                      <Option value="BDT">BDT</Option>
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
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
              ),
            },

            /* ---------------- Security ---------------- */

            {
              key: "security",
              label: (
                <>
                  <SafetyOutlined /> Security
                </>
              ),
              children: (
                <Form
                  form={securityForm}
                  layout="vertical"
                  initialValues={{
                    sessionTimeout: 30,
                    passwordLength: 8,
                    passwordStrength: "strong",
                  }}
                  onFinish={(values) =>
                    handler(securitySettingsSchema.parse(values))
                  }
                  className="max-w-lg"
                >
                  <Form.Item
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                  >
                    <Input type="number" />
                  </Form.Item>

                  <Form.Item
                    label="Minimum Password Length"
                    name="passwordLength"
                  >
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
                  >
                    Save Changes
                  </Button>
                </Form>
              ),
            },

            /* ---------------- Notifications ---------------- */

            {
              key: "notifications",
              label: (
                <>
                  <BellOutlined /> Notifications
                </>
              ),
              children: (
                <Form
                  form={notificationForm}
                  layout="vertical"
                  initialValues={{
                    orderEmail: true,
                    orderSMS: true,
                    marketingEmail: false,
                    systemAlerts: true,
                  }}
                  onFinish={(values) =>
                    handler(notificationSettingsSchema.parse(values))
                  }
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
                    icon={<SaveOutlined />}
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Form>
              ),
            },

            /* ---------------- API Keys ---------------- */

            {
              key: "api",
              label: (
                <>
                  <ApiOutlined /> API Keys
                </>
              ),
              children: (
                <Form
                  form={apiForm}
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
              ),
            },

            /* ---------------- Webhooks ---------------- */

            {
              key: "webhooks",
              label: (
                <>
                  <LinkOutlined /> Webhooks
                </>
              ),
              children: (
                <Form
                  form={webhookForm}
                  layout="vertical"
                  onFinish={(values) => handler(webhookSchema.parse(values))}
                  className="max-w-lg"
                >
                  <Form.Item label="Event" name="eventName">
                    <Select>
                      <Option value="order.created">Order Created</Option>
                      <Option value="order.updated">Order Updated</Option>
                      <Option value="order.delivered">Order Delivered</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Target URL" name="targetUrl">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Secret Key" name="secret">
                    <Input.Password />
                  </Form.Item>

                  <Button type="primary">Save Webhook</Button>
                </Form>
              ),
            },

            /* ---------------- Branding ---------------- */

            {
              key: "branding",
              label: (
                <>
                  <BgColorsOutlined /> Branding
                </>
              ),
              children: (
                <Form
                  form={brandingForm}
                  layout="vertical"
                  onFinish={(values) => handler(brandingSchema.parse(values))}
                  className="max-w-lg"
                >
                  <Form.Item label="Logo URL" name="logo">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Favicon URL" name="favicon">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Invoice Prefix" name="invoicePrefix">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Order Prefix" name="orderPrefix">
                    <Input />
                  </Form.Item>

                  <Button type="primary">Save Branding</Button>
                </Form>
              ),
            },

            /* ---------------- Language ---------------- */

            {
              key: "language",
              label: (
                <>
                  <GlobalOutlined /> Language
                </>
              ),
              children: (
                <Form
                  form={languageForm}
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
              ),
            },

            /* ---------------- Theme ---------------- */

            {
              key: "theme",
              label: (
                <>
                  <BgColorsOutlined /> Appearance
                </>
              ),
              children: (
                <Form
                  form={themeForm}
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
              ),
            },

            /* ---------------- Email ---------------- */

            {
              key: "email",
              label: (
                <>
                  <MailOutlined /> Email
                </>
              ),
              children: (
                <Form
                  form={emailForm}
                  layout="vertical"
                  initialValues={{
                    host: "smtp.example.com",
                    port: 587,
                    sender: "noreply@platform.com",
                    username: "smtp-user",
                    password: "",
                  }}
                  onFinish={(values) =>
                    handler(emailSettingsSchema.parse(values))
                  }
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
                  >
                    Save Changes
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
