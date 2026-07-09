"use client";

import { Button, Card, Form, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";

import { ResponseBrand } from "@/types/product/brands";

import ImageSelectModal from "../../../_components/image-select-modal";

export type BrandStatus = "ACTIVE" | "INACTIVE";

export type BrandFormValues = {
  name: string;
  description?: string;
  logoUrl?: string;
  status: BrandStatus;
};

type BrandFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ResponseBrand>;
  isSubmitting?: boolean;
  onSubmit: (values: BrandFormValues) => void;
  onCancel?: () => void;
};

const BrandForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: BrandFormProps) => {
  const [form] = Form.useForm<BrandFormValues>();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        description: initialValues.description ?? "",
        logoUrl: initialValues.logoUrl ?? "",
        status: initialValues.status ?? "ACTIVE",
      });
    }
  }, [form, initialValues]);

  const logoUrl = Form.useWatch("logoUrl", form);

  const handleFinish = (values: BrandFormValues) => {
    const payload: BrandFormValues = {
      name: values.name.trim(),
      description: values.description?.trim() || "",
      logoUrl: values.logoUrl?.trim() || "",
      status: values.status,
    };

    onSubmit(payload);
  };

  return (
    <Card
      title={mode === "create" ? "Create Brand" : "Update Brand"}
      className="w-full"
    >
      <Form<BrandFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: "",
          description: "",
          logoUrl: "",
          status: "ACTIVE",
        }}
      >
        <Form.Item
          label="Brand Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Brand name is required",
            },
            {
              min: 2,
              message: "Brand name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Nike" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Sportswear brand"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item label="Logo URL" name="logoUrl">
          <Input
            onClick={() => setImageModalOpen(true)}
            readOnly
            placeholder="https://cdn.example.com/brands/nike.png"
          />
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
            {mode === "create" ? "Create Brand" : "Update Brand"}
          </Button>

          {onCancel ? (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          ) : null}
        </Space>
      </Form>

      <ImageSelectModal
        open={imageModalOpen}
        selectedUrl={logoUrl}
        onClose={() => setImageModalOpen(false)}
        onSelect={(url) => {
          form.setFieldValue("logoUrl", url);
        }}
      />
    </Card>
  );
};

export default BrandForm;
