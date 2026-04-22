"use client";

import {
    Card,
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    Row,
    Col,
    Spin,
    message,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/lib/axios";

const { Option } = Select;

export default function VariantUpdateForm() {
    const {id} =useParams();
    const router = useRouter();
    const [form] = Form.useForm();

    /* 🔹 Fetch existing variant */
    const { data, isLoading } = useQuery({
        queryKey: ["variant", id],
        enabled: !!id,
        queryFn: async () => api.get(`/variant/${id}`),
    });

    const variant = data?.data?.data;
    console.log(variant);

    /* 🔹 Update mutation */
    const updateVariant = useMutation({
        mutationFn: (payload: any) =>
            api.put(`/variant/${id}`, payload),
        onSuccess: () => {
            message.success("Variant updated successfully");
            router.back();
        },
        onError: () => {
            message.error("Failed to update variant");
        },
    });

    /* 🔹 Set form values when data arrives */
    useEffect(() => {
        if (variant) {
            form.setFieldsValue({
                product_id: Number(variant.product_id),
                variant_name: variant.variant_name,
                sku: variant.sku,
                barcode: variant.barcode,
                cost_price: Number(variant.cost_price),
                sale_price: Number(variant.sale_price),
                stock_alert_qty: variant.stock_alert_qty,
                status: variant.status,
            });
        }
    }, [variant, form]);

    if (isLoading) return <Spin size="large" />;

    return (
        <Card
            title="Update Variant"
            style={{
                maxWidth: 900,
                margin: "0 auto",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => updateVariant.mutate(values)}
            >
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Product ID"
                            name="product_id"
                            rules={[{ required: true }]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Variant Name"
                            name="variant_name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Barcode" name="barcode">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Cost Price"
                            name="cost_price"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Sale Price"
                            name="sale_price"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Stock Alert Quantity"
                            name="stock_alert_qty"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Status" name="status">
                            <Select>
                                <Option value="Active">Active</Option>
                                <Option value="Inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={updateVariant.isPending}
                    >
                        Update Variant
                    </Button>
                </Row>
            </Form>
        </Card>
    );
}