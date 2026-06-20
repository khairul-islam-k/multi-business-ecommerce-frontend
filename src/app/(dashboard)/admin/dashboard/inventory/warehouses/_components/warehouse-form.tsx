"use client";

import { WarehousePayload, WarehouseStatus } from "@/types/product/warehouse";
import { Button, Card, Form, Input, Select, Space } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;

export type WarehouseFormValues = {
  name: string;
  phone: string;
  address: string;
  status: WarehouseStatus;
};

type WarehouseFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<WarehouseFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: WarehousePayload) => void | Promise<void>;
  onCancel?: () => void;
};

const WarehouseForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: WarehouseFormProps) => {
  const [form] = Form.useForm<WarehouseFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        phone: initialValues.phone ?? "",
        address: initialValues.address ?? "",
        status: initialValues.status ?? "ACTIVE",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: WarehouseFormValues) => {
    const payload: WarehousePayload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      status: values.status,
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Warehouse" : "Update Warehouse"}>
      <Form<WarehouseFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={true}
        initialValues={{
          name: "",
          phone: "",
          address: "",
          status: "ACTIVE",
        }}
      >
        <Form.Item
          label="Warehouse Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Warehouse name is required",
            },
            {
              min: 2,
              message: "Warehouse name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Main warehouse" />
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
            {
              min: 5,
              message: "Address must be at least 5 characters",
            },
          ]}
        >
          <TextArea rows={3} placeholder="House 10, Road 2, Dhaka" />
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

        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
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

export default WarehouseForm;