"use client";

import { useProductAttributeQuery } from "@/lib/api/hooks/product-attribute";
import { useAuthStore } from "@/stores/auth.store";
import type { ResponseProductAttribute } from "@/types/product/attribute";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import ImageSelectModal from "../../../_components/ImageSelectModal";
import { useProduct } from "@/lib/api/hooks/product";
import { ResponseVariant } from "@/types/product/variant";

type VariantStatus = "ACTIVE" | "INACTIVE";

export type VariantPayload = {
  images: {
    imageUrl: string;
    altText: string;
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
    form
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
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
            icon={<DeleteOutlined />}
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
                undefined
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
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  // api
  const { data: attributes, isLoading } = useProductAttributeQuery(businessId);
  // products
  const { data: product } = useProduct(businessId, productId);

  const attributeItems = attributes?.items ?? [];
  const images = Form.useWatch("images", form);

  const selectedImageUrl =
    activeImageIndex !== null ? images?.[activeImageIndex]?.imageUrl : undefined;

  // only create 
  useEffect(() => {
    if (!(mode === 'create')) return;
    form.setFieldsValue({
      priceOverride: Number(product?.price ?? 0),
      weight: Number(product?.weight ?? 0),
    })
  }, [mode, product, form])

  useEffect(() => {
    if (!initialValues) return;

    form.setFieldsValue({
      images: initialValues.images?.length
        ? initialValues.images
        : [{ imageUrl: "", altText: "" }],
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
    const payload: VariantPayload = {
      images: values.images.map((image) => ({
        imageUrl: image.imageUrl.trim(),
        altText: image.altText.trim(),
      })),
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
          images: [{ imageUrl: "", altText: "" }],
          title: "",
          priceOverride: 0,
          weight: 0,
          status: "ACTIVE",
          attributes: [{ attributeId: "", attributeValueId: "" }],
        }}
      >
        <Form.List name="images">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card
                  key={field.key}
                  size="small"
                  title={`Image ${index + 1}`}
                  extra={
                    fields.length > 1 && (
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    )
                  }
                >
                  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                    <Form.Item
                      label="Image URL"
                      name={[field.name, "imageUrl"]}
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
                        onClick={() => {
                          setActiveImageIndex(index);
                          setImageModalOpen(true);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Alt Text"
                      name={[field.name, "altText"]}
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
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add({ imageUrl: "", altText: "" })}
                block
              >
                Add Image
              </Button>
            </div>
          )}
        </Form.List>

        <div className="mt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Red / XL" />
          </Form.Item>

          <Form.Item
            label="Price Override"
            name="priceOverride"
            rules={[
              { required: true, message: "Price override is required" },
            ]}
          >
            <InputNumber min={0}
            style={{width: '100%'}}
            placeholder="1250" />
          </Form.Item>

          <Form.Item
            label="Weight"
            name="weight"
            rules={[{ required: true, message: "Weight is required" }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              style={{width: '100%'}}
              placeholder="0.5"
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
                icon={<PlusOutlined />}
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
          setActiveImageIndex(null);
        }}
        onSelect={(url) => {
          if (activeImageIndex === null) return;

          form.setFieldValue(["images", activeImageIndex, "imageUrl"], url);
          setImageModalOpen(false);
          setActiveImageIndex(null);
        }}
      />
    </Card>
  );
};

export default VariantForm;