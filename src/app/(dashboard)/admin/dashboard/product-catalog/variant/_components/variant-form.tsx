"use client";

import { Button, Card, Form, Input, InputNumber, Select, Space } from "antd";
import { CirclePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useProduct } from "@/lib/api/hooks/product";
import { useProductAttributeQuery } from "@/lib/api/hooks/product-attribute";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseVariant } from "@/types/product/variant";

import ImageSelectModal from "../../../_components/ImageSelectModal";

import type { ResponseProductAttribute } from "@/types/product/attribute";
type VariantStatus = "ACTIVE" | "INACTIVE";

export type VariantPayload = {
  images: {
    imageUrl: string;
    altText: string;
    isThumbnail: boolean;
  }[];
  title: string;
  priceOverride: number;
  weight: number;
  status: VariantStatus;
  attributes: {
    attributeId: string;
    attributeValueId: string;
  }[];
};

type VariantFormValues = VariantPayload;

type VariantFormProps = {
  mode: "create" | "update";
  productId: string;
  initialValues?: Partial<ResponseVariant>;
  isSubmitting?: boolean;
  onSubmit: (payload: VariantPayload) => void | Promise<void>;
  onCancel?: () => void;
};

type AttributeRowProps = {
  fieldName: number;
  remove: (index: number | number[]) => void;
  canRemove: boolean;
  form: ReturnType<typeof Form.useForm<VariantFormValues>>[0];
  attributes: ResponseProductAttribute[];
};

const AttributeRow = ({
  fieldName,
  remove,
  canRemove,
  form,
  attributes,
}: AttributeRowProps) => {
  const selectedAttributeId = Form.useWatch(
    ["attributes", fieldName, "attributeId"],
    form,
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId,
  );

  const attributeValueOptions =
    selectedAttribute?.values?.map((item) => ({
      label: item.value,
      value: item.id,
    })) ?? [];

  return (
    <Card
      size="small"
      title={`Attribute ${fieldName + 1}`}
      extra={
        canRemove && (
          <Button
            danger
            size="small"
            icon={<Trash2 />}
            onClick={() => remove(fieldName)}
          />
        )
      }
    >
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Form.Item
          label="Attribute"
          name={[fieldName, "attributeId"]}
          rules={[{ required: true, message: "Attribute is required" }]}
        >
          <Select
            showSearch
            placeholder="Select attribute"
            optionFilterProp="label"
            options={attributes.map((attribute) => ({
              label: attribute.name,
              value: attribute.id,
            }))}
            onChange={() => {
              form.setFieldValue(
                ["attributes", fieldName, "attributeValueId"],
                undefined,
              );
            }}
          />
        </Form.Item>

        <Form.Item
          label="Attribute Value"
          name={[fieldName, "attributeValueId"]}
          rules={[{ required: true, message: "Attribute value is required" }]}
        >
          <Select
            showSearch
            disabled={!selectedAttributeId}
            placeholder="Select value"
            optionFilterProp="label"
            options={attributeValueOptions}
          />
        </Form.Item>
      </div>
    </Card>
  );
};

const VariantForm = ({
  mode,
  productId,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: VariantFormProps) => {
  const [form] = Form.useForm<VariantFormValues>();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  // api
  const { data: attributes, isLoading } = useProductAttributeQuery(businessId);
  // products
  const { data: product } = useProduct(businessId, productId);

  const attributeItems = attributes?.items ?? [];
  const images = Form.useWatch("images", form);
  const selectedImageUrl = images?.[0]?.imageUrl;

  // only create
  useEffect(() => {
    if (!(mode === "create")) return;
    form.setFieldsValue({
      priceOverride: Number(product?.price ?? 0),
      weight: Number(product?.weight ?? 0),
    });
  }, [mode, product, form]);

  useEffect(() => {
    if (!initialValues) return;
    const initialImage =
      initialValues.images?.find((image) => image.isThumbnail) ??
      initialValues.images?.[0];

    form.setFieldsValue({
      images: [
        {
          imageUrl: initialImage?.imageUrl ?? "",
          altText: initialImage?.altText ?? "",
          isThumbnail: true,
        },
      ],
      title: initialValues.title ?? "",
      priceOverride: Number(initialValues.priceOverride ?? 0),
      weight: Number(initialValues.weight ?? 0),
      status: initialValues.status ?? "ACTIVE",
      attributes: initialValues.attributes?.length
        ? initialValues.attributes
        : [{ attributeId: "", attributeValueId: "" }],
    });
  }, [form, initialValues]);

  const handleFinish = (values: VariantFormValues) => {
    const image = values.images?.[0];
    const payload: VariantPayload = {
      images: image?.imageUrl?.trim()
        ? [
            {
              imageUrl: image.imageUrl.trim(),
              altText: image.altText?.trim() || values.title.trim(),
              isThumbnail: true,
            },
          ]
        : [],
      title: values.title.trim(),
      priceOverride: Number(values.priceOverride),
      weight: Number(values.weight),
      status: values.status,
      attributes: values.attributes.map((item) => ({
        attributeId: item.attributeId,
        attributeValueId: item.attributeValueId,
      })),
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Variant" : "Update Variant"}>
      <Form<VariantFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          images: [{ imageUrl: "", altText: "", isThumbnail: true }],
          title: "",
          priceOverride: 0,
          weight: 0,
          status: "ACTIVE",
          attributes: [{ attributeId: "", attributeValueId: "" }],
        }}
      >
        <Card size="small" title="Variant Thumbnail">
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item
              label="Image URL"
              name={["images", 0, "imageUrl"]}
              rules={[
                {
                  required: true,
                  message: "Image URL is required",
                },
              ]}
            >
              <Input
                readOnly
                placeholder="Select image"
                onClick={() => setImageModalOpen(true)}
              />
            </Form.Item>

            <Form.Item
              label="Alt Text"
              name={["images", 0, "altText"]}
              rules={[
                {
                  required: true,
                  message: "Alt text is required",
                },
              ]}
            >
              <Input placeholder="Front view" />
            </Form.Item>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Red / XL" />
          </Form.Item>

          <Form.Item
            label="Variant selling price"
            tooltip="Enter the variant price in the business currency."
            name="priceOverride"
            rules={[
              { required: true, message: "Price override is required" },
              {
                type: "number",
                min: 0,
                message: "Variant price must be a non-negative number",
              },
            ]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Example: 1250"
            />
          </Form.Item>

          <Form.Item
            label="Variant weight in kilograms"
            tooltip="Use kilograms. Example: 0.5 means 500 grams."
            name="weight"
            rules={[
              { required: true, message: "Weight is required" },
              {
                type: "number",
                min: 0,
                message: "Variant weight must be a non-negative number",
              },
            ]}
          >
            <InputNumber
              min={0}
              precision={3}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="Example: 0.5"
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </Form.Item>
        </div>

        <Form.List name="attributes">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map((field) => (
                <AttributeRow
                  key={field.key}
                  fieldName={field.name}
                  remove={remove}
                  canRemove={fields.length > 1}
                  form={form}
                  attributes={attributeItems}
                />
              ))}

              <Button
                type="dashed"
                icon={<CirclePlus />}
                loading={isLoading}
                onClick={() => add({ attributeId: "", attributeValueId: "" })}
                block
              >
                Add Attribute
              </Button>
            </div>
          )}
        </Form.List>

        <Space className="mt-6">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Variant" : "Update Variant"}
          </Button>

          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Space>
      </Form>

      <ImageSelectModal
        open={imageModalOpen}
        selectedUrl={selectedImageUrl ?? undefined}
        onClose={() => {
          setImageModalOpen(false);
        }}
        onSelect={(url) => {
          form.setFieldValue(["images", 0, "imageUrl"], url);
          form.setFieldValue(["images", 0, "isThumbnail"], true);
          setImageModalOpen(false);
        }}
      />
    </Card>
  );
};

export default VariantForm;
