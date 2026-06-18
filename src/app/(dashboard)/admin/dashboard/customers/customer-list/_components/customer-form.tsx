"use client";

import { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import { CustomerPayload, CustomerStatus } from "@/types/customer/customer";

const { TextArea } = Input;

type CustomerFormValues = {
  name: string;
  email?: string;
  phone?: string;
  status: CustomerStatus;
  note?: string;
};

type CustomerInitialData = {
  name: string;
  email?: string | null;
  phone?: string | null;
  status: CustomerStatus;
  note?: string | null;
};

type CustomerFormProps = {
  initialData?: CustomerInitialData;
  loading?: boolean;
  onSubmit: (payload: CustomerPayload) => void | Promise<void>;
};

export default function CustomerForm({
  initialData,
  loading = false,
  onSubmit,
}: CustomerFormProps) {
  const [form] = Form.useForm<CustomerFormValues>();

  const isUpdate = Boolean(initialData);

  useEffect(() => {
    if (!initialData) return;

    form.setFieldsValue({
      name: initialData.name,
      email: initialData.email ?? undefined,
      phone: initialData.phone ?? undefined,
      status: initialData.status,
      note: initialData.note ?? undefined,
    });
  }, [initialData, form]);

  const handleFinish = async (values: CustomerFormValues) => {
    const payload: CustomerPayload = {
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      status: values.status,
      note: values.note || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Card title={isUpdate ? "Update Customer" : "Create Customer"}>
      <Form<CustomerFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          status: "ACTIVE",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Customer Name"
              name="name"
              rules={[
                { required: true, message: "Please enter customer name" },
              ]}
            >
              <Input placeholder="John Wick" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select
                placeholder="Select status"
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                  { label: "Blocked", value: "BLOCKED" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="+8801700000000" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Note" name="note">
              <TextArea rows={4} placeholder="Frequent buyer" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isUpdate ? "Update Customer" : "Create Customer"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}