"use client";

import { useProductAttribute } from "@/lib/api/hooks/product-attribute";
import { useAuthStore } from "@/stores/auth.store";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
  Space,
} from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ImageSelectModal from "../../../_components/ImageSelectModal";
import { imageUrlSet } from "../../products/_components/image-url";
import { ResponseVariant, VariantPayload } from "@/types/product/variant";

export type VariantFormValues = ResponseVariant;

type SelectOption = {
  label: string;
  value: string;
};

type AttributeValue = {
  id: string;
  value: string;
};

type ProductAttribute = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  values: AttributeValue[];
};

type VariantFormProps = {
  mode: "create" | "update";
  productId: string;
  initialValues?: Partial<VariantFormValues>;
  isSubmitting?: boolean;
  onSubmit: (payload: VariantPayload) => Promise<void> | void;
  onCancel?: () => void;
};

const VariantForm = ({
  mode,
  productId,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: VariantFormProps) => {
  const [form] = Form.useForm<VariantFormValues>();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const images = Form.useWatch("images", form);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: attributes,
    isLoading: isAttributeLoading,
    isFetching: isAttributeFetching,
  } = useProductAttribute(businessId, productId);

  const attributeList = useMemo(() => {
    return (attributes ?? []) as ProductAttribute[];
  }, [attributes]);

  const attributeOptions: SelectOption[] = useMemo(() => {
    return attributeList
      .filter((attribute) => attribute.status === "ACTIVE")
      .map((attribute) => ({
        label: attribute.name,
        value: attribute.id,
      }));
  }, [attributeList]);

  const attributeValueOptionsMap: Record<string, SelectOption[]> = useMemo(() => {
    return attributeList.reduce<Record<string, SelectOption[]>>(
      (acc, attribute) => {
        acc[attribute.id] =
          attribute.values?.map((item) => ({
            label: item.value,
            value: item.id,
          })) ?? [];

        return acc;
      },
      {}
    );
  }, [attributeList]);

  useEffect(() => {
    if (!initialValues) return;

    form.setFieldsValue({
      images: initialValues.images?.length
        ? initialValues.images.map((image) => ({
            imageUrl: image.imageUrl ?? "",
            altText: image.altText ?? "",
          }))
        : [
            {
              imageUrl: "",
              altText: "",
            },
          ],

      title: initialValues.title ?? "",
      price: initialValues.price ?? 0,
      weight: initialValues.weight ?? 0,
      status: initialValues.status ?? "ACTIVE",

      attributes: initialValues.attributes?.length
        ? initialValues.attributes.map((item) => ({
            attributeId: item.attributeId,
            attributeValueId: item.attributeValueId,
          }))
        : [
            {
              attributeId: "",
              attributeValueId: "",
            },
          ],
    });
  }, [form, initialValues]);

  const openImageModal = (index: number) => {
    setActiveImageIndex(index);
    setImageModalOpen(true);
  };

  const handleSelectImage = (url: string) => {
    if (activeImageIndex === null) return;

    form.setFieldValue(["images", activeImageIndex, "imageUrl"], url);

    setImageModalOpen(false);
    setActiveImageIndex(null);
  };

  const selectedImageUrl =
    activeImageIndex !== null
      ? images?.[activeImageIndex]?.imageUrl
      : undefined;

  const handleFinish = async (values: VariantFormValues) => {
    const payload: VariantPayload = {
      images:
        values.images
          ?.filter((image) => image.imageUrl?.trim())
          .map((image) => ({
            imageUrl: image.imageUrl.trim(),
            altText: image.altText?.trim() || values.title.trim(),
          })) ?? [],

      title: values.title.trim(),
      price: Number(values.price ?? 0),
      weight: Number(values.weight ?? 0),
      status: values.status,

      attributes:
        values.attributes
          ?.filter((item) => item.attributeId && item.attributeValueId)
          .map((item) => ({
            attributeId: item.attributeId,
            attributeValueId: item.attributeValueId,
          })) ?? [],
    };

    await onSubmit(payload);

    if (mode === "create") {
      form.resetFields();
    }
  };

  if (isAttributeLoading || isAttributeFetching) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <>
      <Card title={mode === "create" ? "Create Variant" : "Update Variant"}>
        <Form<VariantFormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            images: [
              {
                imageUrl: "",
                altText: "",
              },
            ],
            title: "",
            sku: "",
            barcode: "",
            price: 0,
            weight: 0,
            status: "ACTIVE",
            attributes: [
              {
                attributeId: "",
                attributeValueId: "",
              },
            ],
          }}
        >
          <Form.Item
            label="Variant Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Variant title is required",
              },
            ]}
          >
            <Input placeholder="Red / XL" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Price is required",
                },
              ]}
            >
              <InputNumber min={0} style={{
                width: '100%'
              }} placeholder="1200" />
            </Form.Item>

            <Form.Item label="Weight" name="weight">
              <InputNumber min={0} style={{
                width: '100%'
              }} placeholder="0.5" />
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
          </div>

          <Divider titlePlacement="left">Variant Images</Divider>

          <Form.List name="images">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const currentImageUrl = images?.[index]?.imageUrl;

                  return (
                    <div
                      key={field.key}
                      className="rounded-lg border bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="m-0 font-medium">Image {index + 1}</h4>

                        {fields.length > 1 ? (
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr]">
                        <div
                          onClick={() => openImageModal(index)}
                          className="h-[120px] w-[120px] cursor-pointer overflow-hidden rounded-lg border bg-white"
                        >
                          {currentImageUrl ? (
                            <Image
                              src={imageUrlSet(currentImageUrl)}
                              alt="Variant image"
                              width={120}
                              height={120}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              Click to select
                            </div>
                          )}
                        </div>

                        <div>
                          <Form.Item
                            label="Image URL"
                            name={[field.name, "imageUrl"]}
                            rules={[
                              {
                                required: index === 0,
                                message: "Image is required",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Click to select image"
                              readOnly
                              onClick={() => openImageModal(index)}
                              className="cursor-pointer"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Alt Text"
                            name={[field.name, "altText"]}
                          >
                            <Input placeholder="Front view" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      imageUrl: "",
                      altText: "",
                    })
                  }
                >
                  Add Image
                </Button>
              </div>
            )}
          </Form.List>

          <Divider titlePlacement="left">Variant Attributes</Divider>

          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="rounded-lg border bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="m-0 font-medium">
                        Attribute {index + 1}
                      </h4>

                      {fields.length > 1 ? (
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Form.Item
                        label="Attribute Name"
                        name={[field.name, "attributeId"]}
                        rules={[
                          {
                            required: true,
                            message: "Attribute is required",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Select attribute"
                          options={attributeOptions}
                          optionFilterProp="label"
                          onChange={() => {
                            form.setFieldValue(
                              ["attributes", field.name, "attributeValueId"],
                              undefined
                            );
                          }}
                        />
                      </Form.Item>

                      <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => {
                          const selectedAttributeId = getFieldValue([
                            "attributes",
                            field.name,
                            "attributeId",
                          ]);

                          const valueOptions =
                            attributeValueOptionsMap[selectedAttributeId] ?? [];

                          return (
                            <Form.Item
                              label="Attribute Value"
                              name={[field.name, "attributeValueId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Attribute value is required",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                placeholder={
                                  selectedAttributeId
                                    ? "Select attribute value"
                                    : "Select attribute first"
                                }
                                options={valueOptions}
                                optionFilterProp="label"
                                disabled={!selectedAttributeId}
                              />
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </div>
                  </div>
                ))}

                <Button
                  type="dashed"
                  style={{marginBottom: '20px'}}
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      attributeId: "",
                      attributeValueId: "",
                    })
                  }
                >
                  Add Attribute
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item className="mb-0 mt-6">
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {mode === "create" ? "Create Variant" : "Update Variant"}
              </Button>

              {onCancel ? (
                <Button onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              ) : null}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <ImageSelectModal
        open={imageModalOpen}
        selectedUrl={selectedImageUrl}
        onClose={() => {
          setImageModalOpen(false);
          setActiveImageIndex(null);
        }}
        onSelect={handleSelectImage}
      />
    </>
  );
};

export default VariantForm;