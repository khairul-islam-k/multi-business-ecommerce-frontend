"use client";

import { Form as AntdForm, Input, Select, Button, Row, Col } from "antd";
import useSubmit from "@/hooks/use-submit";

interface Props {
  initialValues?: any;
  mode: "add" | "edit";
  onSubmit: (values: any) => Promise<void>;
}

export default function Form({ initialValues, mode, onSubmit }: Props) {
  const [form] = AntdForm.useForm();

  const { loading, handler } = useSubmit(async (values: any) => {
    await onSubmit(values);
  });

  return (
    <AntdForm
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={handler}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <AntdForm.Item
            name="name"
            label="Company Name"
            rules={[{ required: true }]}
          >
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item
            name="domain"
            label="Company Domain"
            rules={[{ required: true }]}
          >
            <Input prefix="https://" />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="code" label="Code">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="logo_url" label="Logo Url">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="phone" label="Phone number"
            rules={[{ required: true }]}
          >
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="district"
            rules={[{ required: true }]}
            label="District">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="city"
            rules={[{ required: true }]}
            label="City">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="country"
            rules={[{ required: true }]}
            label="Country">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item
            rules={[{ required: true }]}
            name="subdomain" label="subdomain">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
            label="Email">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="status" label="Status">
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="default_currency" label="Default currency">
            <Select
              options={[
                { label: "BDT", value: "BDT" },
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        {/* Full width row */}
        <Col span={24}>
          <AntdForm.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </AntdForm.Item>
        </Col>

        {/* Button full width */}
        <Col span={24}>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "add" ? "Create Company" : "Update Company"}
            </Button>
          </div>
        </Col>
      </Row>
    </AntdForm>
  );
}
