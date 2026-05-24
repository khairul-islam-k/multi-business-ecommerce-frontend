"use client";

import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    Select,
    Space,
} from "antd";
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

type SelectOption = {
    label: string;
    value: string;
};

type ProductFormProps = {
    mode: "create" | "update";
    initialValues?: Partial<ResponseProduct>;
    isSubmitting?: boolean;

    onSubmit: (values: ProductPayload) => void;
    onCancel?: () => void;
};

const ProductForm = ({
    mode,
    initialValues,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: ProductFormProps) => {
    const [form] = Form.useForm<ProductPayload>();

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

    const images = Form.useWatch("images", form);

    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : "";

    // tagId
    const arrayTagId = useMemo(() => {
        return (
            initialValues?.tags?.map((tag) => tag.tagId)
        );
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
                description: initialValues.description ?? "",
                categoryId: initialValues.categoryId,
                brandId: initialValues.brandId,
                unitId: initialValues.unitId,
                status: initialValues.status ?? "DRAFT",
                tagIds: arrayTagId ?? [],
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

    const handleFinish = (values: ProductPayload) => {
        const payload: ProductPayload = {
            images:
                values.images
                    ?.filter((image) => image.imageUrl?.trim())
                    .map((image) => ({
                        imageUrl: image.imageUrl.trim(),
                        altText: image.altText?.trim() || values.name.trim(),
                    })) ?? [],

            name: values.name.trim(),
            description: values.description?.trim() || "",
            categoryId: values.categoryId,
            brandId: values.brandId,
            unitId: values.unitId,
            status: values.status,
            tagIds: values.tagIds ?? [],
        };

        onSubmit(payload);
    };

    const selectedImageUrl =
        activeImageIndex !== null
            ? images?.[activeImageIndex]?.imageUrl
            : undefined;

    return (
        <>
            <Card title={mode === "create" ? "Create Product" : "Update Product"}>
                <Form<ProductPayload>
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