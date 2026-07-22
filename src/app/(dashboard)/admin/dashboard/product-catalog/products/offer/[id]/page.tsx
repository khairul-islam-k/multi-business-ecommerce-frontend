"use client";

import { useEffect } from "react";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    InputNumber,
    message,
    Row,
    Skeleton,
    Space,
    Switch,
    Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ArrowLeft, BadgePercent, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useProduct, useProductMutation } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { UpdateProductOfferPayload } from "@/types/product/product";
import { getApiErrorMessage } from "@/lib/axios";

dayjs.extend(utc);

const { Title, Text } = Typography;

type OfferFormValues = {
    inOffer: boolean;
    offerPrice?: number;
    startingFrom?: Dayjs;
    endsIn?: Dayjs;
};

const UpdateOffer = () => {
    const [form] = Form.useForm<OfferFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const business = useAuthStore((state) => state.selectedBusiness);
    const businessId = business?.id ?? "";

    const {
        data: product,
        isLoading,
        isError,
    } = useProduct(businessId, id);

    const inOffer = Form.useWatch("inOffer", form);
    const offerPrice = Form.useWatch("offerPrice", form);
    const startingFrom = Form.useWatch("startingFrom", form);

    const regularPrice = Number(product?.price ?? 0);
    const currentOfferPrice = Number(offerPrice ?? 0);

    const { updateProduct } = useProductMutation(businessId);

    const discountPercentage =
        regularPrice > 0 &&
            currentOfferPrice > 0 &&
            currentOfferPrice < regularPrice
            ? ((regularPrice - currentOfferPrice) / regularPrice) * 100
            : 0;

    useEffect(() => {
        if (!product) return;

        form.setFieldsValue({
            inOffer: product.inOffer ?? false,

            offerPrice: product.offerPrice
                ? Number(product.offerPrice)
                : undefined,

            startingFrom: product.startingFrom
                ? dayjs.utc(product.startingFrom)
                : undefined,

            endsIn: product.endsIn ? dayjs.utc(product.endsIn) : undefined,
        });
    }, [form, product]);

    const handleOfferStatusChange = (checked: boolean) => {
        form.setFieldValue("inOffer", checked);

        if (!checked) {
            form.setFieldsValue({
                offerPrice: undefined,
                startingFrom: undefined,
                endsIn: undefined,
            });

            form.setFields([
                {
                    name: "offerPrice",
                    errors: [],
                },
                {
                    name: "startingFrom",
                    errors: [],
                },
                {
                    name: "endsIn",
                    errors: [],
                },
            ]);
        }
    };

    const handleSubmit = async (values: OfferFormValues) => {
        const payload: UpdateProductOfferPayload = {
            inOffer: values.inOffer,

            offerPrice: String(values.offerPrice),

            startingFrom:
                values.inOffer && values.startingFrom
                    ? dayjs
                        .utc(values.startingFrom.format("YYYY-MM-DD"))
                        .startOf("day")
                        .toISOString()
                    : null,

            endsIn:
                values.inOffer && values.endsIn
                    ? dayjs
                        .utc(values.endsIn.format("YYYY-MM-DD"))
                        .endOf("day")
                        .toISOString()
                    : null,
        };

        try { 
            await updateProduct.mutateAsync({
                productId: id,
                payload,
              });

            router.push('/admin/dashboard/product-catalog/products');
            messageApi.success("Offer payload created successfully");
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    const handleReset = () => {
        if (!product) {
            form.resetFields();
            return;
        }

        form.setFieldsValue({
            inOffer: product.inOffer ?? false,

            offerPrice:
                product.offerPrice !== null &&
                    product.offerPrice !== undefined &&
                    product.offerPrice !== ""
                    ? Number(product.offerPrice)
                    : undefined,

            startingFrom: product.startingFrom
                ? dayjs.utc(product.startingFrom)
                : undefined,

            endsIn: product.endsIn ? dayjs.utc(product.endsIn) : undefined,
        });
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-6">
                <Card>
                    <Skeleton active />
                </Card>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="p-4 md:p-6">
                <Card>
                    <div className="flex min-h-60 flex-col items-center justify-center gap-4 text-center">
                        <Title level={4} className="!mb-0">
                            Product not found
                        </Title>

                        <Text type="secondary">
                            The product could not be loaded. Please try again.
                        </Text>

                        <Button
                            icon={<ArrowLeft className="h-4 w-4" />}
                            onClick={() => router.back()}
                        >
                            Go Back
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <>
            {contextHolder}

            <div className="p-4 md:p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <PageHeader
                                title="Update Product Offer"
                                subtitle="Configure the offer status, discounted price, start date, and end date for this product."
                                actions={<Button
                                    icon={<ArrowLeft className="h-4 w-4" />}
                                    onClick={() => router.back()}
                                >
                                    Back
                                </Button>}
                                breadcrumb={adminBreadcrumb}
                            />
                        </div>

                    </div>

                    <Card className="shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                <BadgePercent className="h-6 w-6" />
                            </div>

                            <div>
                                <Title level={4} className="!mb-0">
                                    Offer Information
                                </Title>

                                <Text type="secondary">
                                    Regular price: ৳{regularPrice.toLocaleString()}
                                </Text>
                            </div>
                        </div>

                        <Form<OfferFormValues>
                            form={form}
                            layout="vertical"
                            initialValues={{
                                inOffer: false,
                            }}
                            onFinish={handleSubmit}
                        >
                            <Row gutter={[16, 8]}>
                                <Col xs={24}>
                                    <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 p-4">
                                        <div>
                                            <div className="font-semibold">Offer Status</div>

                                            <Text type="secondary">
                                                Enable or disable the product offer.
                                            </Text>
                                        </div>

                                        <Form.Item
                                            name="inOffer"
                                            valuePropName="checked"
                                            noStyle
                                        >
                                            <Switch
                                                checkedChildren="Active"
                                                unCheckedChildren="Inactive"
                                                onChange={handleOfferStatusChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="offerPrice"
                                        label="Offer Price"
                                        dependencies={["inOffer"]}
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (!inOffer) return;

                                                    if (
                                                        value === undefined ||
                                                        value === null ||
                                                        value === ""
                                                    ) {
                                                        throw new Error(
                                                            "Please enter the offer price",
                                                        );
                                                    }

                                                    if (Number(value) <= 0) {
                                                        throw new Error(
                                                            "Offer price must be greater than zero",
                                                        );
                                                    }

                                                    if (Number(value) >= regularPrice) {
                                                        throw new Error(
                                                            `Offer price must be less than ৳${regularPrice}`,
                                                        );
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            className="w-full"
                                            min={0}
                                            precision={2}
                                            disabled={!inOffer}
                                            placeholder="Enter offer price"
                                            addonBefore="৳"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="mb-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-[10px]">
                                        <Text type="secondary">Discount</Text>

                                        <div className="mt-1 text-lg font-semibold text-green-600">
                                            {discountPercentage.toFixed(2)}%
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="startingFrom"
                                        label="Starting From"
                                        dependencies={["inOffer"]}
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (inOffer && !value) {
                                                        throw new Error(
                                                            "Please select the offer start date",
                                                        );
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className="w-full"
                                            format="DD MMM YYYY"
                                            disabled={!inOffer}
                                            placeholder="Select start date"
                                            onChange={() => {
                                                const endingDate =
                                                    form.getFieldValue("endsIn");

                                                const startDate =
                                                    form.getFieldValue("startingFrom");

                                                if (
                                                    startDate &&
                                                    endingDate &&
                                                    endingDate.isBefore(startDate, "day")
                                                ) {
                                                    form.setFieldValue("endsIn", undefined);
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="endsIn"
                                        label="Ends In"
                                        dependencies={["inOffer", "startingFrom"]}
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (!inOffer) return;

                                                    if (!value) {
                                                        throw new Error(
                                                            "Please select the offer end date",
                                                        );
                                                    }

                                                    if (
                                                        startingFrom &&
                                                        value.isBefore(startingFrom, "day")
                                                    ) {
                                                        throw new Error(
                                                            "End date cannot be before the start date",
                                                        );
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className="w-full"
                                            format="DD MMM YYYY"
                                            disabled={!inOffer}
                                            placeholder="Select end date"
                                            disabledDate={(current) => {
                                                if (!startingFrom) return false;

                                                return current.isBefore(
                                                    startingFrom.startOf("day"),
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="mt-3 flex justify-end border-t border-gray-200 pt-5">
                                <Space wrap>
                                    <Button onClick={handleReset}>Reset</Button>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<Save className="h-4 w-4" />}
                                    >
                                        Save Offer
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default UpdateOffer;