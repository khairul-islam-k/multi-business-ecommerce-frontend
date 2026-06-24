"use client";

import { Button, Card, Form, Input, Select, Space, Switch } from "antd";
import { useEffect } from "react";
import { ProductTagPayload } from "@/types/product/product";

export type TagStatus = "ACTIVE" | "INACTIVE";

export type TagFormValues = {
  name: string;
  isFeatured: boolean;
  status: TagStatus;
};

export type TagPayload = ProductTagPayload;

type TagFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<TagFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: TagPayload) => void;
  onCancel?: () => void;
};

const TagForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TagFormProps) => {
  const [form] = Form.useForm<TagFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        isFeatured: initialValues.isFeatured ?? false,
        status: initialValues.status ?? "ACTIVE",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: TagFormValues) => {
    const payload: TagPayload = {
      name: values.name.trim(),
      isFeatured: values.isFeatured ?? false,
      status: values.status,
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Tag" : "Update Tag"}>
      <Form<TagFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: "",
          isFeatured: false,
          status: "ACTIVE",
        }}
      >
        <Form.Item
          label="Tag Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Tag name is required",
            },
            {
              min: 2,
              message: "Tag name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="New Arrival" />
        </Form.Item>

        <Form.Item
          label="Featured"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch checkedChildren="Featured" unCheckedChildren="Regular" />
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
            {mode === "create" ? "Create Tag" : "Update Tag"}
          </Button>

          {onCancel ? (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          ) : null}
        </Space>
      </Form>
    </Card>
  );
};

export default TagForm;
