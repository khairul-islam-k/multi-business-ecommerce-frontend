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
import {
  BulkUpdateVariantItemPayload,
  ResponseVariant,
  VariantPayload,
} from "@/types/product/variant";

type SelectOption = {
  label: string;
  value: string;
};

type ProductFormVariant = VariantPayload & {
  variantId?: string;
  variantKey?: string;
};

type ProductVariantOption = {
  attributeId?: string;
  attributeValueIds?: string[];
};

type ProductFormValues = ProductPayload & {
  enableVariants?: boolean;
  variantOptions?: ProductVariantOption[];
  variants?: ProductFormVariant[];
};

type ProductFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ResponseProduct>;
  isSubmitting?: boolean;
  onSubmit: (
    values: ProductPayload,
    variants: BulkUpdateVariantItemPayload[],
  ) => void;
  onCancel?: () => void;
};

type VariantPreviewItem = {
  variantKey: string;
  title: string;
  attributes: {
    attributeId: string;
    attributeValueId: string;
    label: string;
  }[];
};

type VariantBuilderProps = {
  form: FormInstance<ProductFormValues>;
  businessId: string;
};

type VariantOptionRowProps = {
  form: FormInstance<ProductFormValues>;
  fieldName: number;
  remove: (index: number | number[]) => void;
  canRemove: boolean;
  selectedOptions: ProductVariantOption[];
  attributes: ResponseProductAttribute[];
};

const getVariantKey = (
  attributes:
    | {
        attributeId: string;
        attributeValueId: string;
      }[]
    | undefined,
) => {
  const valueIds = attributes
    ?.map((attribute) => attribute.attributeValueId)
    .filter(Boolean)
    .sort();

  return valueIds?.length ? valueIds.join("|") : "";
};

const normalizeVariantImages = (images: VariantPayload["images"] | undefined) =>
  images
    ?.filter((image) => image.imageUrl?.trim())
    .map((image) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText?.trim() || "",
    })) ?? [];

const getProductVariants = (
  variants: Partial<ResponseProduct>["variants"],
): ResponseVariant[] => (Array.isArray(variants) ? variants : []);

const getInitialVariantOptions = (
  variants: ResponseVariant[],
): ProductVariantOption[] => {
  const grouped = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    variant.attributes?.forEach((attribute) => {
      if (!grouped.has(attribute.attributeId)) {
        grouped.set(attribute.attributeId, new Set());
      }

      grouped.get(attribute.attributeId)?.add(attribute.attributeValueId);
    });
  });

  const options = Array.from(grouped.entries()).map(
    ([attributeId, valueIds]) => ({
      attributeId,
      attributeValueIds: Array.from(valueIds),
    }),
  );

  return options.length
    ? options
    : [
        {
          attributeId: undefined,
          attributeValueIds: [],
        },
      ];
};

const getInitialVariants = (
  variants: ResponseVariant[],
): ProductFormVariant[] =>
  variants.map((variant) => {
    const attributes =
      variant.attributes?.map((attribute) => ({
        attributeId: attribute.attributeId,
        attributeValueId: attribute.attributeValueId,
      })) ?? [];

    return {
      variantId: variant.id,
      variantKey: getVariantKey(attributes) || variant.id,
      images: normalizeVariantImages(
        variant.images?.map((image) => ({
          imageUrl: image.imageUrl ?? "",
          altText: image.altText ?? "",
        })),
      ),
      title: variant.title ?? "",
      priceOverride: Number(variant.priceOverride ?? 0),
      weight: Number(variant.weight ?? 0),
      status: variant.status ?? "ACTIVE",
      attributes,
    };
  });

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
    variantKey: getVariantKey(items),
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

const VariantBuilder = ({ form, businessId }: VariantBuilderProps) => {
  const { data: attributes, isLoading } = useProductAttributeQuery(businessId);
  const watchedOptions = Form.useWatch("variantOptions", form);
  const watchedVariants = Form.useWatch("variants", form);
  const price = Form.useWatch("price", form);
  const weight = Form.useWatch("weight", form);

  const attributeItems = useMemo(() => attributes?.items ?? [], [attributes]);
  const selectedOptions = useMemo(
    () => watchedOptions ?? [],
    [watchedOptions],
  );
  const variantRows = useMemo(
    () => watchedVariants ?? [],
    [watchedVariants],
  );
  const previews = useMemo(
    () => getVariantPreviews(selectedOptions, attributeItems),
    [attributeItems, selectedOptions],
  );

  useEffect(() => {
    if (!attributeItems.length) return;

    if (!previews.length) {
      form.setFieldValue("variants", []);
      return;
    }

    const currentVariants = form.getFieldValue("variants") ?? [];
    const variantsByKey = new Map(
      currentVariants.map((variant: ProductFormVariant) => [
        variant.variantKey || getVariantKey(variant.attributes),
        variant,
      ]),
    );

    form.setFieldValue(
      "variants",
      previews.map((preview) => {
        const existing = variantsByKey.get(preview.variantKey);

        if (existing) {
          return {
            ...existing,
            variantKey: preview.variantKey,
            attributes: preview.attributes.map((attribute) => ({
              attributeId: attribute.attributeId,
              attributeValueId: attribute.attributeValueId,
            })),
          };
        }

        return {
          variantKey: preview.variantKey,
          images: [],
          title: preview.title,
          priceOverride: Number(form.getFieldValue("price") ?? 0),
          weight: Number(form.getFieldValue("weight") ?? 0),
          status: "ACTIVE",
          attributes: preview.attributes.map((attribute) => ({
            attributeId: attribute.attributeId,
            attributeValueId: attribute.attributeValueId,
          })),
        };
      }),
    );
  }, [attributeItems.length, form, previews]);

  const getAttributeLabels = (variant: ProductFormVariant | undefined) =>
    variant?.attributes
      ?.map((item) => {
        const attribute = attributeItems.find(
          (attributeItem) => attributeItem.id === item.attributeId,
        );
        const value = attribute?.values?.find(
          (attributeValue) => attributeValue.id === item.attributeValueId,
        );

        return value?.value ?? item.attributeValueId;
      })
      .filter(Boolean) ?? [];

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
          <Tag color="blue">{variantRows.length} variants</Tag>
        </div>

        <Form.List name="variants">
          {(fields, { remove }) =>
            fields.length ? (
              <div className="space-y-3">
                {fields.map((field) => {
                  const row = variantRows[field.name];

                  return (
                    <div
                      key={field.key}
                      className="rounded-md border bg-white p-3"
                    >
                      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                          {getAttributeLabels(row).map((label) => (
                            <Tag key={label}>{label}</Tag>
                          ))}
                        </div>

                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Form.Item name={[field.name, "variantId"]} hidden>
                          <Input />
                        </Form.Item>

                        <Form.Item name={[field.name, "variantKey"]} hidden>
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="Title"
                          name={[field.name, "title"]}
                          rules={[
                            {
                              required: true,
                              message: "Variant title is required",
                            },
                          ]}
                        >
                          <Input placeholder="Black XL" />
                        </Form.Item>

                        <Form.Item
                          label="Price"
                          name={[field.name, "priceOverride"]}
                          rules={[
                            {
                              required: true,
                              message: "Variant price is required",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder={String(price ?? 0)}
                          />
                        </Form.Item>

                        <Form.Item label="Weight" name={[field.name, "weight"]}>
                          <InputNumber
                            min={0}
                            step={0.1}
                            style={{ width: "100%" }}
                            placeholder={String(weight ?? 0)}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Status"
                          name={[field.name, "status"]}
                          rules={[
                            {
                              required: true,
                              message: "Variant status is required",
                            },
                          ]}
                        >
                          <Select
                            options={[
                              { label: "Active", value: "ACTIVE" },
                              { label: "Inactive", value: "INACTIVE" },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
          }
        </Form.List>
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

  const arrayTagId = useMemo(() => {
    return initialValues?.tags?.map((tag) => tag.tagId);
  }, [initialValues]);

  const { data: categories } = useProductCategoriesQuery(businessId);
  const categoryOptions: SelectOption[] = useMemo(() => {
    return (
      categories?.items?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [categories]);

  const { data: brands } = useProductBrandQuery(businessId);
  const brandOptions: SelectOption[] = useMemo(() => {
    return (
      brands?.items?.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })) ?? []
    );
  }, [brands]);

  const { data: units } = useProductUnitQuery(businessId);
  const unitOptions: SelectOption[] = useMemo(() => {
    return (
      units?.items?.map((unit) => ({
        label: unit.name,
        value: unit.id,
      })) ?? []
    );
  }, [units]);

  const { data: tags } = useProductTagQuery(businessId);
  const tagOptions: SelectOption[] = useMemo(() => {
    return (
      tags?.items?.map((tag) => ({
        label: tag.name,
        value: tag.id,
      })) ?? []
    );
  }, [tags]);

  useEffect(() => {
    if (!initialValues) return;

    const initialVariants = getProductVariants(initialValues.variants);

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
      enableVariants: initialVariants.length > 0,
      variantOptions: getInitialVariantOptions(initialVariants),
      variants: getInitialVariants(initialVariants),
    });
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

    const formVariants = form.getFieldValue("variants") ?? [];
    const variants: BulkUpdateVariantItemPayload[] = values.enableVariants
      ? formVariants.map((variant: ProductFormVariant) => ({
          variantId: variant.variantId,
          images: normalizeVariantImages(variant.images),
          title: variant.title.trim(),
          priceOverride: Number(variant.priceOverride ?? values.price ?? 0),
          weight: Number(variant.weight ?? values.weight ?? 0),
          status: variant.status ?? "ACTIVE",
          attributes:
            variant.attributes?.map((attribute) => ({
              attributeId: attribute.attributeId,
              attributeValueId: attribute.attributeValueId,
            })) ?? [],
        }))
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
            variants: [],
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

          <Divider titlePlacement="left">Variants</Divider>

          <Form.Item
            label="Manage Variants"
            name="enableVariants"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
              onChange={(checked) => {
                if (!checked) {
                  form.setFieldsValue({
                    variantOptions: [
                      {
                        attributeId: undefined,
                        attributeValueIds: [],
                      },
                    ],
                    variants: [],
                  });
                }
              }}
            />
          </Form.Item>

          {enableVariants ? (
            <VariantBuilder form={form} businessId={businessId} />
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
