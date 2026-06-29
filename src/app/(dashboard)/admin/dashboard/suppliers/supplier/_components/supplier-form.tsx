"use client";

import { Button, Card, Form, Input, Select, Space } from "antd";
import { useEffect } from "react";

import { SupplierPayload, SupplierStatus } from "@/types/suppliers/supplier";

const { TextArea } = Input;

export type SupplierFormValues = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: SupplierStatus;
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
        requiredMark={true}
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

        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[
            {
              required: true,
              message: "Company name is required",
            },
            {
              min: 2,
              message: "Company name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Acme Supply Ltd." />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Email is required",
            },
            {
              type: "email",
              message: "Enter a valid email address",
            },
          ]}
        >
          <Input placeholder="buyer@acme.test" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Phone number is required",
            },
          ]}
        >
          <Input placeholder="+8801700000000" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Address is required",
            },
          ]}
        >
          <TextArea rows={3} placeholder="House 10, Road 2, Dhaka" />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[
            {
              required: true,
              message: "City is required",
            },
          ]}
        >
          <Input placeholder="Dhaka" />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          rules={[
            {
              required: true,
              message: "Country is required",
            },
          ]}
        >
          <Input placeholder="Bangladesh" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Status is required",
            },
          ]}
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

        <Form.Item label="Note" name="note">
          <TextArea rows={4} placeholder="Preferred local supplier" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Supplier" : "Update Supplier"}
          </Button>

          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default SupplierForm;
