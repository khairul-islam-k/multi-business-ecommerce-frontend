"use client";

import { Button, Card, Form, Input, message, Select, Space } from "antd";
import { useEffect, useMemo, useState } from "react";

import { useProductCategoriesQuery } from "@/lib/api/hooks/product-categories";
import {
  buildCategoryOptions,
  flattenCategories,
  getCategoryDescendantIds,
} from "@/lib/product/category-options";
import { useAuthStore } from "@/stores/auth.store";

import ImageSelectModal from "../../../_components/ImageSelectModal";

const { TextArea } = Input;

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type ProductCategory = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  status: CategoryStatus;
};

export type ProductCategoryFormValues = {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  status: CategoryStatus;
};

type ProductCategoryFormProps = {
  initialData?: ProductCategory | null;
  onSubmit: (values: ProductCategoryFormValues) => Promise<void>;
};

const ProductCategoryForm = ({
  initialData,
  onSubmit,
}: ProductCategoryFormProps) => {
  const [form] = Form.useForm<ProductCategoryFormValues>();
  const [loading, setLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";

  const { data: categories, isLoading } = useProductCategoriesQuery(
    businessId,
    {
      limit: 100,
    },
  );

  const categoryOptions = useMemo(() => {
    const categoryItems = categories?.items ?? [];
    const currentCategory = initialData?.id
      ? flattenCategories(categoryItems).find(
          (category) => category.id === initialData.id,
        )
      : undefined;
    const excludedIds = new Set<string>();

    if (currentCategory?.id) {
      excludedIds.add(currentCategory.id);
      getCategoryDescendantIds(currentCategory).forEach((id) =>
        excludedIds.add(id),
      );
    }

    return buildCategoryOptions(categoryItems, {
      excludeIds: Array.from(excludedIds),
    });
  }, [categories?.items, initialData?.id]);

  const imageUrl = Form.useWatch("imageUrl", form);

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
        parentId: initialData.parentId ?? undefined,
        status: initialData.status,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = async (values: ProductCategoryFormValues) => {
    try {
      setLoading(true);

      const payload: ProductCategoryFormValues = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
        imageUrl: values.imageUrl?.trim() || "",
        parentId: values.parentId || undefined,
        status: values.status,
      };

      await onSubmit(payload);

      if (!isEditMode) {
        form.resetFields();
      }
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isEditMode ? "Update Product Category" : "Create Product Category"}
      style={{
        margin: "24px auto",
      }}
    >
      <Form<ProductCategoryFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          status: "ACTIVE",
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Category name is required",
            },
            {
              min: 2,
              message: "Category name must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Example: Shoes" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              max: 500,
              message: "Description cannot be more than 500 characters",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Example: Footwear and accessories"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="imageUrl"
          rules={[
            {
              required: true,
              message: "Photo is required",
            },
          ]}
        >
          <Input
            onClick={() => setImageModalOpen(true)}
            readOnly
            placeholder="https://cdn.example.com/categories/shoes.jpg"
          />
        </Form.Item>

        <Form.Item label="Parent Category" name="parentId">
          <Select
            placeholder="Select parent category"
            loading={isLoading}
            allowClear
            showSearch
            options={categoryOptions}
            optionFilterProp="label"
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

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? "Update Category" : "Create Category"}
            </Button>

            <Button htmlType="button" onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <ImageSelectModal
        open={imageModalOpen}
        selectedUrl={imageUrl}
        onClose={() => setImageModalOpen(false)}
        onSelect={(url) => {
          form.setFieldValue("imageUrl", url);
        }}
      />
    </Card>
  );
};

export default ProductCategoryForm;
