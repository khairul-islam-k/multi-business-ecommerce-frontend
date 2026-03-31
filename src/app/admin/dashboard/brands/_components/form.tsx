"use client";

import { Form as AntdForm, Input, Select, Button, Row, Col } from "antd";
import useSubmit from "@/hooks/use-submit";

export default function Form({ initialValues, mode, onSubmit }: any) {
  const [form] = AntdForm.useForm();
  const { loading, handler } = useSubmit(onSubmit);

  return (
    <AntdForm
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={handler}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <AntdForm.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="slug" label="Slug">
            <Input />
          </AntdForm.Item>
        </Col>

        <Col xs={24} md={12}>
          <AntdForm.Item name="logo" label="Logo URL">
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

        <Col span={24}>
          <AntdForm.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </AntdForm.Item>
        </Col>

        <Col span={24}>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "add" ? "Create Brand" : "Update Brand"}
            </Button>
          </div>
        </Col>
      </Row>
    </AntdForm>
  );
}
