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
            name="companyName"
            label="Company Name"
            rules={[{ required: true }]}
          >
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item
            name="companyDomain"
            label="Company Domain"
            rules={[{ required: true }]}
          >
            <Input prefix="https://" />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="industry" label="Industry">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="employees" label="Employees">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="plan" label="Plan">
            <Select
              options={[
                { label: "Basic", value: "Basic" },
                { label: "Pro", value: "Pro" },
                { label: "Enterprise", value: "Enterprise" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="status" label="Status">
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Trial", value: "Trial" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        {/* Full width row */}
        <Col span={24}>
          <AntdForm.Item name="description" label="Description">
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
