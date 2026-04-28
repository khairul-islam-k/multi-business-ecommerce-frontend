"use client";

import { Form, Input, Select, Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import useSubmit from "@/hooks/use-submit";
import { generalSettingsSchema, GeneralSettingsValues } from "../schemas";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

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
  );
}
