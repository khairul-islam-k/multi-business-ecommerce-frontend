"use client";

import { Button, Card, Form, Input, Space } from "antd";
import { useEffect } from "react";

import {
  AttributeValuePayload,
  ResponseAttributeValue,
} from "@/types/product/attribute";

type AttributeValueFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ResponseAttributeValue>;
  isSubmitting?: boolean;
  onSubmit: (values: AttributeValuePayload) => void | Promise<void>;
  onCancel?: () => void;
};

const AttributeValueForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: AttributeValueFormProps) => {
  const [form] = Form.useForm<AttributeValuePayload>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        value: initialValues.value ?? "",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: AttributeValuePayload) => {
    const payload: AttributeValuePayload = {
      value: values.value.trim(),
    };

    onSubmit(payload);
  };

  return (
    <Card
      title={
        mode === "create" ? "Create Attribute Value" : "Update Attribute Value"
      }
    >
      <Form<AttributeValuePayload>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          value: "",
        }}
      >
        <Form.Item
          label="Value"
          name="value"
          rules={[
            {
              required: true,
              message: "Attribute value is required",
            },
            {
              min: 2,
              message: "Attribute value must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Red" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Value" : "Update Value"}
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

export default AttributeValueForm;
