"use client";

import { z } from "zod";
import {
  SettingOutlined,
  SafetyOutlined,
  MailOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Card, Form, Input, Select, Button, Tabs, message } from "antd";

import PageHeader from "@/components/shared/page-header";
import useSubmit from "@/hooks/use-submit";

const { Option } = Select;

export const generalSettingsSchema = z.object({
  platformName: z.string().min(1),
  timezone: z.enum(["utc", "est"]),
  currency: z.enum(["bdt", "usd", "inr"]),
});

export const securitySettingsSchema = z.object({
  sessionTimeout: z.number().min(5),
  passwordLength: z.number().min(6),
  passwordStrength: z.enum(["basic", "medium", "strong"]),
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
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;

export default function SettingsPage() {
  const [generalForm] = Form.useForm<GeneralSettingsValues>();
  const [securityForm] = Form.useForm<SecuritySettingsValues>();
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
            {
              key: "general",
              label: (
                <>
                  <SettingOutlined /> General
                </>
              ),
              children: (
                <Form<GeneralSettingsValues>
                  form={generalForm}
                  layout="vertical"
                  initialValues={{
                    platformName: "OneComm",
                    timezone: "utc",
                    currency: "bdt",
                  }}
                  onFinish={(values) =>
                    handler(generalSettingsSchema.parse(values))
                  }
                  className="max-w-lg"
                >
                  <Form.Item<GeneralSettingsValues>
                    label="Platform name"
                    name="platformName"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item<GeneralSettingsValues>
                    label="Default timezone"
                    name="timezone"
                  >
                    <Select>
                      <Option value="utc">UTC</Option>
                      <Option value="est">EST</Option>
                      <Option value="pst">PST</Option>
                      <Option value="cet">CET</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item<GeneralSettingsValues>
                    label="Default currency"
                    name="currency"
                  >
                    <Select>
                      <Option value="bdt">BDT</Option>
                      <Option value="usd">USD</Option>
                      <Option value="eur">EUR</Option>
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

            {
              key: "security",
              label: (
                <>
                  <SafetyOutlined /> Security
                </>
              ),
              children: (
                <Form<SecuritySettingsValues>
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
                  <Form.Item<SecuritySettingsValues>
                    label="Session timeout (minutes)"
                    name="sessionTimeout"
                  >
                    <Input type="number" />
                  </Form.Item>

                  <Form.Item<SecuritySettingsValues>
                    label="Minimum password length"
                    name="passwordLength"
                  >
                    <Input type="number" />
                  </Form.Item>

                  <Form.Item<SecuritySettingsValues>
                    label="Password requirements"
                    name="passwordStrength"
                  >
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
              ),
            },

            {
              key: "email",
              label: (
                <>
                  <MailOutlined /> Email
                </>
              ),
              children: (
                <Form<EmailSettingsValues>
                  form={emailForm}
                  layout="vertical"
                  initialValues={{
                    host: "smtp.example.com",
                    port: 587,
                    sender: "noreply@platform.com",
                    username: "smtp-user",
                    password: "password",
                  }}
                  onFinish={(values) =>
                    handler(emailSettingsSchema.parse(values))
                  }
                  className="max-w-lg"
                >
                  <Form.Item<EmailSettingsValues> label="SMTP Host" name="host">
                    <Input />
                  </Form.Item>

                  <Form.Item<EmailSettingsValues> label="Port" name="port">
                    <Input type="number" />
                  </Form.Item>

                  <Form.Item<EmailSettingsValues>
                    label="Sender email"
                    name="sender"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item<EmailSettingsValues>
                    label="SMTP Username"
                    name="username"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item<EmailSettingsValues>
                    label="SMTP Password"
                    name="password"
                  >
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
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
