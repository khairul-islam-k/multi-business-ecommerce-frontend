"use client";

import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Tag,
} from "antd";
import type { FormInstance } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ImageSelectModal from "../../../_components/ImageSelectModal";
import { useProductCategoriesQuery } from "@/lib/api/hooks/product-categories";
import { useAuthStore } from "@/stores/auth.store";
import { useProductBrandQuery } from "@/lib/api/hooks/product-brand";
import { useProductUnitQuery } from "@/lib/api/hooks/product-unit";
import { useProductTagQuery } from "@/lib/api/hooks/product-tags";
import { imageUrlSet } from "./image-url";
import { ProductPayload, ResponseProduct } from "@/types/product/product";
import { useProductAttributeQuery } from "@/lib/api/hooks/product-attribute";
import { ResponseProductAttribute } from "@/types/product/attribute";
import { VariantPayload } from "@/types/product/variant";

type SelectOption = {
  label: string;
  value: string;
};

type ProductFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ResponseProduct>;
  isSubmitting?: boolean;

  onSubmit: (values: ProductPayload, variants: VariantPayload[]) => void;
  onCancel?: () => void;
};

type ProductVariantOption = {
  attributeId?: string;
  attributeValueIds?: string[];
};

type ProductFormValues = ProductPayload & {
  enableVariants?: boolean;
  variantOptions?: ProductVariantOption[];
  generatedVariants?: VariantPayload[];
};

type VariantPreviewItem = {
  title: string;
  attributes: {
    attributeId: string;
    attributeValueId: string;
    label: string;
  }[];
};

type VariantBuilderProps = {
  businessId: string;
  form: FormInstance<ProductFormValues>;
};

type VariantOptionRowProps = {
  form: FormInstance<ProductFormValues>;
  fieldName: number;
  remove: (index: number | number[]) => void;
  canRemove: boolean;
  selectedOptions: ProductVariantOption[];
  attributes: ResponseProductAttribute[];
};

const getVariantPreviews = (
  variantOptions: ProductVariantOption[] | undefined,
  attributes: ResponseProductAttribute[],
): VariantPreviewItem[] => {
  const selectedGroups =
    variantOptions
      ?.map((option) => {
        const attribute = attributes.find(
          (item) => item.id === option.attributeId,
        );

        const values =
          option.attributeValueIds
            ?.map((valueId) =>
              attribute?.values?.find((value) => value.id === valueId),
            )
            .filter(Boolean)
            .map((value) => ({
              attributeId: attribute?.id ?? "",
              attributeValueId: value?.id ?? "",
              label: value?.value ?? "",
            })) ?? [];

        return {
          attributeId: attribute?.id,
          values,
        };
      })
      .filter((group) => group.attributeId && group.values.length) ?? [];

  if (!selectedGroups.length) return [];

  const combinations = selectedGroups.reduce<
    VariantPreviewItem["attributes"][]
  >(
    (previous, group) =>
      previous.flatMap((items) =>
        group.values.map((value) => [...items, value]),
      ),
    [[]],
  );

  return combinations.map((items) => ({
    title: items.map((item) => item.label).join(" "),
    attributes: items,
  }));
};

const VariantOptionRow = ({
  form,
  fieldName,
  remove,
  canRemove,
  selectedOptions,
  attributes,
}: VariantOptionRowProps) => {
  const selectedAttributeId = Form.useWatch(
    ["variantOptions", fieldName, "attributeId"],
    form,
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId,
  );

  const selectedAttributeIds = selectedOptions
    .map((option) => option.attributeId)
    .filter(Boolean);

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="m-0 font-medium">Attribute {fieldName + 1}</h4>

        {canRemove ? (
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => remove(fieldName)}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Item
          label="Attribute"
          name={[fieldName, "attributeId"]}
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
            optionFilterProp="label"
            options={attributes.map((attribute) => ({
              label: attribute.name,
              value: attribute.id,
              disabled:
                attribute.id !== selectedAttributeId &&
                selectedAttributeIds.includes(attribute.id),
            }))}
            onChange={() => {
              form.setFieldValue(
                ["variantOptions", fieldName, "attributeValueIds"],
                [],
              );
            }}
          />
        </Form.Item>

        <Form.Item
          label="Values"
          name={[fieldName, "attributeValueIds"]}
          rules={[
            {
              required: true,
              message: "Select at least one value",
            },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            disabled={!selectedAttributeId}
            placeholder="Select values"
            optionFilterProp="label"
            options={
              selectedAttribute?.values?.map((value) => ({
                label: value.value,
                value: value.id,
              })) ?? []
            }
          />
        </Form.Item>
      </div>
    </div>
  );
};

const VariantBuilder = ({ businessId, form }: VariantBuilderProps) => {
    const { data: attributes, isLoading } = useProductAttributeQuery(businessId);
    const watchedOptions = Form.useWatch("variantOptions", form);
    const attributeItems = useMemo(() => attributes?.items ?? [], [attributes]);
    const selectedOptions = useMemo(
        () => watchedOptions ?? [],
        [watchedOptions],
    );
    const price = Form.useWatch("price", form);
    const weight = Form.useWatch("weight", form);
  const previews = useMemo(
    () => getVariantPreviews(selectedOptions, attributeItems),
    [attributeItems, selectedOptions],
  );
  const generatedVariants = useMemo<VariantPayload[]>(
    () =>
      previews.map((preview) => ({
        images: [],
        title: preview.title,
        priceOverride: Number(price ?? 0),
        weight: Number(weight ?? 0),
        status: "ACTIVE",
        attributes: preview.attributes.map((attribute) => ({
          attributeId: attribute.attributeId,
          attributeValueId: attribute.attributeValueId,
        })),
      })),
    [previews, price, weight],
  );

  useEffect(() => {
    form.setFieldValue("generatedVariants", generatedVariants);
  }, [form, generatedVariants]);

  return (
    <div className="space-y-4">
      <Form.List name="variantOptions">
        {(fields, { add, remove }) => (
          <div className="space-y-4">
            {fields.map((field) => (
              <VariantOptionRow
                key={field.key}
                form={form}
                fieldName={field.name}
                remove={remove}
                canRemove={fields.length > 1}
                selectedOptions={selectedOptions}
                attributes={attributeItems}
              />
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              loading={isLoading}
              disabled={fields.length >= attributeItems.length}
              onClick={() =>
                add({
                  attributeId: undefined,
                  attributeValueIds: [],
                })
              }
            >
              Add Attribute
            </Button>
          </div>
        )}
      </Form.List>

      <div className="rounded-lg border p-4">
        <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <h4 className="m-0 font-medium">Generated Variants</h4>
          <Tag color="blue">{previews.length} variants</Tag>
        </div>

        {previews.length ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {previews.map((preview) => (
              <div
                key={preview.title}
                className="flex items-center justify-between rounded-md border bg-white px-3 py-2"
              >
                <span className="font-medium">{preview.title}</span>
                <span className="text-sm text-gray-500">
                  BDT {Number(price ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

const ProductForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [form] = Form.useForm<ProductFormValues>();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const images = Form.useWatch("images", form);
  const enableVariants = Form.useWatch("enableVariants", form);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";

  // tagId
  const arrayTagId = useMemo(() => {
    return initialValues?.tags?.map((tag) => tag.tagId);
  }, [initialValues]);

  // categories
  const { data: categories } = useProductCategoriesQuery(businessId);

  const categoryOptions: SelectOption[] = useMemo(() => {
    return (
      categories?.items?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [categories]);

  // brands
  const { data: brands } = useProductBrandQuery(businessId);

  const brandOptions: SelectOption[] = useMemo(() => {
    return (
      brands?.items?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [brands]);

  // units
  const { data: units } = useProductUnitQuery(businessId);
  const unitOptions: SelectOption[] = useMemo(() => {
    return (
      units?.items?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [units]);

  // tagOptions
  const { data: tags } = useProductTagQuery(businessId);
  const tagOptions: SelectOption[] = useMemo(() => {
    return (
      tags?.items?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [tags]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        images: initialValues.images?.length
          ? initialValues.images
          : [
              {
                imageUrl: "",
                altText: "",
              },
            ],
        name: initialValues.name ?? "",
        price: Number(initialValues.price) ?? 0,
        weight: Number(initialValues.weight) ?? 0,
        description: initialValues.description ?? "",
        categoryId: initialValues.categoryId,
        brandId: initialValues.brandId,
        unitId: initialValues.unitId,
        status: initialValues.status ?? "DRAFT",
        tagIds: arrayTagId ?? [],
        enableVariants: false,
        variantOptions: [
          {
            attributeId: undefined,
            attributeValueIds: [],
          },
        ],
        generatedVariants: [],
      });
    }
  }, [form, initialValues, arrayTagId]);

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

  const handleFinish = (values: ProductFormValues) => {
    const payload: ProductPayload = {
      images:
        values.images
          ?.filter((image) => image.imageUrl?.trim())
          .map((image) => ({
            imageUrl: image.imageUrl.trim(),
            altText: image.altText?.trim() || values.name.trim(),
          })) ?? [],

      name: values.name.trim(),
      price: values.price,
      weight: values.weight,
      description: values.description?.trim() || "",
      categoryId: values.categoryId,
      brandId: values.brandId,
      unitId: values.unitId,
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    const variants: VariantPayload[] = values.enableVariants
      ? (values.generatedVariants ?? [])
      : [];

    onSubmit(payload, variants);
  };

  const selectedImageUrl =
    activeImageIndex !== null
      ? images?.[activeImageIndex]?.imageUrl
      : undefined;

  return (
    <>
      <Card title={mode === "create" ? "Create Product" : "Update Product"}>
        <Form<ProductFormValues>
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
            name: "",
            description: "",
            status: "DRAFT",
            tagIds: [],
            enableVariants: false,
            variantOptions: [
              {
                attributeId: undefined,
                attributeValueIds: [],
              },
            ],
            generatedVariants: [],
          }}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Product name is required",
              },
              {
                min: 2,
                message: "Product name must be at least 2 characters",
              },
            ]}
          >
            <Input placeholder="Classic sneaker" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Product price is required",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Price" />
            </Form.Item>

            <Form.Item label="Weight" name="weight">
              <InputNumber style={{ width: "100%" }} placeholder="Weight" />
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Comfortable everyday sneaker"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Divider titlePlacement="left">Product Images</Divider>

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
                        <div className="h-[120px] w-[120px] overflow-hidden rounded-lg border bg-white">
                          {currentImageUrl ? (
                            <Image
                              src={imageUrlSet(currentImageUrl)}
                              alt="Product image"
                              width={120}
                              height={120}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                              No Image
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
                              placeholder="/uploads/media/product.jpg"
                              readOnly
                              addonAfter={
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => openImageModal(index)}
                                >
                                  Choose
                                </Button>
                              }
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

          <Divider titlePlacement="left">Product Information</Divider>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Category is required",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select category"
                options={categoryOptions}
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="Brand"
              name="brandId"
              rules={[
                {
                  required: true,
                  message: "Brand is required",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select brand"
                options={brandOptions}
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="Unit"
              name="unitId"
              rules={[
                {
                  required: true,
                  message: "Unit is required",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select unit"
                options={unitOptions}
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
                placeholder="Select status"
                options={[
                  {
                    label: "Draft",
                    value: "DRAFT",
                  },
                  {
                    label: "Active",
                    value: "ACTIVE",
                  },
                  {
                    label: "Inactive",
                    value: "INACTIVE",
                  },
                  {
                    label: "Archived",
                    value: "ARCHIVED",
                  },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item label="Tags" name="tagIds">
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select product tags"
              options={tagOptions}
              optionFilterProp="label"
            />
          </Form.Item>

          {mode === "create" ? (
            <>
              <Divider titlePlacement="left">Variants</Divider>

              <Form.Item
                label="Create Variants"
                name="enableVariants"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                  onChange={(checked) => {
                    if (!checked) {
                      form.setFieldValue("generatedVariants", []);
                    }
                  }}
                />
              </Form.Item>

              {enableVariants ? (
                <VariantBuilder businessId={businessId} form={form} />
              ) : null}
            </>
          ) : null}

          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {mode === "create" ? "Create Product" : "Update Product"}
            </Button>

            {onCancel ? (
              <Button onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            ) : null}
          </Space>
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

export default ProductForm;
