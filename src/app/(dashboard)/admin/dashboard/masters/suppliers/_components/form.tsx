"use client";

import { Form as AntdForm, Input, Select, Button, Row, Col } from "antd";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Form({ initialValues, mode, onSubmit, loading }: any) {
  const [form] = AntdForm.useForm();

  return (
    <AntdForm
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      key={initialValues?.id || "create"} // ensures proper reset on edit
    >
      <Row gutter={[16, 16]}>
        {/* NAME */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </AntdForm.Item>
        </Col>

        {/* CODE */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </AntdForm.Item>
        </Col>

        {/* EMAIL */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="email" label="Email">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* PHONE */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="phone" label="Phone">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* CONTACT PERSON */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="contact_person" label="Contact Person">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* CITY */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="city" label="City">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* DISTRICT */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="district" label="District">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* COUNTRY */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="country" label="Country">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* ADDRESS */}
        <Col xs={24}>
          <AntdForm.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </AntdForm.Item>
        </Col>

        {/* NOTES */}
        <Col xs={24}>
          <AntdForm.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </AntdForm.Item>
        </Col>

        {/* STATUS */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="status" label="Status" initialValue="Active">
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        {/* SUBMIT */}
        <Col span={24}>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "add" ? "Create Supplier" : "Update Supplier"}
            </Button>
          </div>
        </Col>
      </Row>
    </AntdForm>
  );
}
