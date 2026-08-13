"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";
import { WarehousePayload, WarehouseStatus } from "@/types/product/warehouse";

const { TextArea } = Input;

export type WarehouseFormValues = {
  name: string;
  phone?: string;
  address?: string;

  redxAreaId?: string;
  redxAreaName?: string;
  redxPostCode?: string;
  redxPickupStoreId?: string;

  status?: WarehouseStatus;
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
    if (!initialValues) return;

    form.setFieldsValue({
      name: initialValues.name ?? "",
      phone: initialValues.phone ?? undefined,
      address: initialValues.address ?? undefined,
      status: initialValues.status ?? undefined,
    });
  }, [form, initialValues]);



  const handleFinish = (values: WarehouseFormValues) => {
    const payload: WarehousePayload = {
      name: values.name.trim(),

      ...(values.phone?.trim()
        ? {
          phone: values.phone.trim(),
        }
        : {}),

      ...(values.address?.trim()
        ? {
          address: values.address.trim(),
        }
        : {}),

      ...(values.status
        ? {
          status: values.status,
        }
        : {}),
    };

    console.log("payload", payload);

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Warehouse" : "Update Warehouse"}>
      <Form<WarehouseFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark
        initialValues={{
          name: "",
          phone: undefined,
          address: undefined,
          status: undefined,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
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
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone"
              name="phone"
              validateTrigger="onChange"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    const phone = String(value).trim();
                    const bdPhoneRegex = /^(\+?8801|01)[3-9]\d{8}$/;

                    if (!bdPhoneRegex.test(phone)) {
                      return Promise.reject(
                        new Error("Enter a valid Bangladesh phone number"),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="+8801700000000" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Status" name="status">
              <Select
                allowClear
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

          <Col xs={24} md={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }

                    if (String(value).trim().length < 5) {
                      return Promise.reject(
                        new Error("Address must be at least 5 characters"),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea rows={3} placeholder="House 10, Road 2, Dhaka" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="redxAreaName" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="redxPostCode" hidden>
          <Input />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space wrap>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
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

export default WarehouseForm;
