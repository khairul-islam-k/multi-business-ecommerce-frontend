"use client";

import { Form, Input, Switch, Button, Card, Select } from "antd";

interface CourierFormValues {
  courier: string;
  account: string;
  contact: string;
  merchantId: string;
  cod: boolean;
  webhook: string;
  status: "Active" | "Inactive";
}

const defaultValues: CourierFormValues = {
  courier: "TCS Express",
  account: "ShopAdmin-TCS",
  contact: "+92-21-111-123-456",
  merchantId: "TCS-M-001",
  cod: true,
  webhook: "https://api.shopadmin.com/webhooks/tcs",
  status: "Active",
};

const UpdateCourier = () => {
  const [form] = Form.useForm<CourierFormValues>();

  const onFinish = (values: CourierFormValues) => {
    console.log("Form values:", values);
  };

  return (
    <div>
      <Card title="Courier Configuration" style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues}
          onFinish={onFinish}
        >
          <Form.Item
            label="Courier Name"
            name="courier"
            rules={[{ required: true, message: "Courier name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: "Account is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: true, message: "Contact number is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Merchant ID"
            name="merchantId"
            rules={[{ required: true, message: "Merchant ID is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cash on Delivery (COD)"
            name="cod"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Webhook URL"
            name="webhook"
            rules={[
              { required: true, message: "Webhook URL is required" },
              { type: "url", message: "Enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Configuration
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateCourier;
