"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, Form, Input, InputNumber, Button, Select, Row, Col, message } from "antd";
import Swal from "sweetalert2";

const { Option } = Select;

export default function VariantCreateForm() {
    const [form] = Form.useForm();

    const {
        data: products,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () =>
            api.get(
                `/products?sortBy=createdAt&sortOrder=DESC`
            ),
    });

    console.log('products', products?.data?.data?.data);

    const onFinish = async (values: any) => {

        try {
            // await api.post("/variant", values);
            api.post('/variant', values)
                .then(res => {
                    form.resetFields();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: "<a href=\"#\">Why do I have this issue?</a>"
            });
        }
    };

    return (
        <Card
            title="Create Variant"
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
                onFinish={onFinish}
                initialValues={{
                    status: "Active",
                }}
            >
                <Row gutter={24}>
                    {/* Product ID */}
                    <Col xs={24} md={12}>

                        <Form.Item
                            label="Product"
                            name="product_id"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select product"
                                options={products?.data?.data?.data?.map((c: any) => ({
                                    label: c.name,
                                    value: Number(c.id),
                                }))}
                            />
                        </Form.Item>
                    </Col>

                    {/* Variant Name */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Variant Name"
                            name="name"
                            rules={[{ required: true, message: "Variant name is required" }]}
                        >
                            <Input placeholder="e.g. Red - XL" />
                        </Form.Item>
                    </Col>

                    {/* SKU */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="SKU"
                            name="sku"
                            rules={[{ required: true, message: "SKU is required" }]}
                        >
                            <Input placeholder="SKU123" />
                        </Form.Item>
                    </Col>

                    {/* Barcode */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Barcode"
                            name="barcode"
                        >
                            <Input placeholder="123456789" />
                        </Form.Item>
                    </Col>

                    {/* Cost Price */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Cost Price"
                            name="cost_price"
                            rules={[{ required: true, message: "Cost price is required" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                placeholder="100"
                            />
                        </Form.Item>
                    </Col>

                    {/* Sale Price */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Sale Price"
                            name="sale_price"
                            rules={[{ required: true, message: "Sale price is required" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                placeholder="150"
                            />
                        </Form.Item>
                    </Col>

                    {/* Stock Alert Qty */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Stock Alert Quantity"
                            name="stock_alert_qty"
                            rules={[{ required: true, message: "Stock alert quantity is required" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                placeholder="5"
                            />
                        </Form.Item>
                    </Col>

                    {/* Status */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Option value="Active">Active</Option>
                                <Option value="Inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Actions */}
                <Row justify="end">
                    <Button type="primary" htmlType="submit">
                        Create Variant
                    </Button>
                </Row>
            </Form>
        </Card>
    );
}