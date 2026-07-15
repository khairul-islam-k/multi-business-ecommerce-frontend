"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";

import { SupplierPayload, SupplierStatus } from "@/types/suppliers/supplier";

const { TextArea } = Input;

export type SupplierFormValues = {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: SupplierStatus;
  note?: string | null;
};

type SupplierFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<SupplierFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: SupplierPayload) => void | Promise<void>;
  onCancel?: () => void;
};

const SupplierForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SupplierFormProps) => {
  const [form] = Form.useForm<SupplierFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        companyName: initialValues.companyName ?? "",
        email: initialValues.email ?? "",
        phone: initialValues.phone ?? "",
        address: initialValues.address ?? "",
        city: initialValues.city ?? "Dhaka",
        country: initialValues.country ?? "Bangladesh",
        status: initialValues.status ?? "ACTIVE",
        note: initialValues.note ?? "",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: SupplierFormValues) => {
    const payload: SupplierPayload = {
      name: values.name.trim(),
      companyName: values.companyName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      status: values.status,
      note: values.note?.trim() || null,
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Supplier" : "Update Supplier"}>
      <Form<SupplierFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark
        initialValues={{
          name: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
          city: "Dhaka",
          country: "Bangladesh",
          status: "ACTIVE",
          note: "",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Supplier Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Supplier name is required",
                },
                {
                  min: 2,
                  message: "Supplier name must be at least 2 characters",
                },
              ]}
            >
              <Input placeholder="Acme Supply" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
            >
              <Input placeholder="Acme Supply Ltd." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
            >
              <Input placeholder="buyer@acme.test" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone"
              name="phone"
            >
              <Input placeholder="+8801700000000" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="City"
              name="city"
            >
              <Input placeholder="Dhaka" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Country"
              name="country"
            >
              <Input placeholder="Bangladesh" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
            >
              <Select
                placeholder="Select status"
                options={[
                  {
                    label: "Active",
                    value: "ACTIVE",
                  },
                  {
                    label: "Inactive",
                    value: "INACTIVE",
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Address"
              name="address"
            >
              <TextArea rows={3} placeholder="House 10, Road 2, Dhaka" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Note" name="note">
              <TextArea rows={4} placeholder="Preferred local supplier" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space wrap>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {mode === "create" ? "Create Supplier" : "Update Supplier"}
            </Button>

            {onCancel && (
              <Button
                htmlType="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SupplierForm;
