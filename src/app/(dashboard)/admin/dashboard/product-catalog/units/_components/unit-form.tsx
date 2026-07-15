"use client";

import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";

export type UnitStatus = "ACTIVE" | "INACTIVE";

export type UnitFormValues = {
  name: string;
  status: UnitStatus;
};

export type UnitPayload = {
  name: string;
  status: UnitStatus;
};

type UnitFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<UnitFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: UnitPayload) => void;
  onCancel?: () => void;
};

const UnitForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: UnitFormProps) => {
  const [form] = Form.useForm<UnitFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        status: initialValues.status ?? "ACTIVE",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: UnitFormValues) => {
    const payload: UnitPayload = {
      name: values.name.trim(),
      status: values.status,
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Unit" : "Update Unit"}>
      <Form<UnitFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: "",
          status: "ACTIVE",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Unit Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Unit name is required",
                },
                {
                  min: 2,
                  message: "Unit name must be at least 2 characters",
                },
              ]}
            >
              <Input placeholder="Piece" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {mode === "create" ? "Create Unit" : "Update Unit"}
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

export default UnitForm;
