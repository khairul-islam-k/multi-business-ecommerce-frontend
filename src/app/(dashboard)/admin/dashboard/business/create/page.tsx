"use client";

import React from "react";
import currencyCodes from "currency-codes";
import { getTimeZones } from "@vvo/tzdb";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Switch,
} from "antd";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

type BusinessFormValues = {
    name: string;
    slug: string;
    email: string;
    phone: string;
    country: string;
    currencyCode: string;
    timezone: string;
    status: "TRIAL" | "ACTIVE" | "SUSPENDED";

    settings: {
        orderPrefix: string;
        invoicePrefix: string;
        defaultLanguage: string;
        defaultCurrency: string;
        timezone: string;
        lowStockThreshold: number;
        allowBackorder: boolean;
        autoConfirmOrder: boolean;
        codEnabled: boolean;
        onlinePaymentEnabled: boolean;
    };

    branding: {
        logoUrl: string;
        faviconUrl: string;
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        fontFamily: string;
        seoTitle: string;
        seoDescription: string;
    };
};

const initialValues = {

    branding: {
        logoUrl: "https://example.com/logo.png",
        faviconUrl: "https://example.com/favicon.ico",
        primaryColor: "#000742",
        secondaryColor: "#ffffff",
        accentColor: "#f97316",
    },
};

const currencyOptions = currencyCodes.data.map((item) => ({
    label: `${item.code} - ${item.currency}`,
    value: item.code,
}));

const timezoneOptions = getTimeZones().map((timezone) => ({
    label: `${timezone.name} (${timezone.currentTimeFormat})`,
    value: timezone.name,
}));

export default function BusinessForm() {
    const [form] = Form.useForm<BusinessFormValues>();
    const accessToken = useAuthStore((state)=> state.accessToken);
    console.log('token', accessToken);

    const onFinish = async (values: BusinessFormValues) => {
        console.log("form values", values);
        const res = await api.post('/businesses', values);
        console.log(res.data);
        
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
        >
            <Card title="Business Info" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="name"
                            label="Business Name"
                            rules={[{ required: true, message: "Business name is required" }]}
                        >
                            <Input placeholder="New Business" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[{ required: true, message: "Slug is required" }]}
                        >
                            <Input placeholder="new-business" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Email is required" },
                                { type: "email", message: "Enter valid email" },
                            ]}
                        >
                            <Input placeholder="business@example.com" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item name="phone" label="Phone">
                            <Input placeholder="+8801712345678" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name="country" label="Country">
                            <Input placeholder="Bangladesh" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name="currencyCode" label="Currency Code">
                            <Select
                                showSearch
                                placeholder="Select currency"
                                options={currencyOptions}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name="timezone" label="Timezone">
                            <Select
                                showSearch
                                placeholder="Select timezone"
                                options={timezoneOptions}
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name="status" label="Status">
                            <Select
                                placeholder="Select status"
                                options={[
                                    { label: "Trial", value: "TRIAL" },
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Inactive", value: "INACTIVE" },
                                    { label: "Suspended", value: "SUSPENDED" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title="Settings" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item name={["settings", "orderPrefix"]} label="Order Prefix">
                            <Input placeholder="ORD" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["settings", "invoicePrefix"]} label="Invoice Prefix">
                            <Input placeholder="INV" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["settings", "defaultLanguage"]} label="Default Language">
                            <Input placeholder="en" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["settings", "defaultCurrency"]} label="Default Currency">
                            <Input placeholder="BDT" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["settings", "timezone"]} label="Timezone">
                            <Input placeholder="Asia/Dhaka" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name={["settings", "lowStockThreshold"]}
                            label="Low Stock Threshold"
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name={["settings", "allowBackorder"]}
                            label="Allow Backorder"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name={["settings", "autoConfirmOrder"]}
                            label="Auto Confirm Order"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name={["settings", "codEnabled"]}
                            label="COD Enabled"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name={["settings", "onlinePaymentEnabled"]}
                            label="Online Payment"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title="Branding" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item name={["branding", "logoUrl"]} label="Logo URL">
                            <Input placeholder="https://example.com/logo.png" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item name={["branding", "faviconUrl"]} label="Favicon URL">
                            <Input placeholder="https://example.com/favicon.ico" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["branding", "primaryColor"]} label="Primary Color">
                            <Input type="color" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["branding", "secondaryColor"]} label="Secondary Color">
                            <Input type="color" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item name={["branding", "accentColor"]} label="Accent Color">
                            <Input type="color" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item name={["branding", "fontFamily"]} label="Font Family">
                            <Input placeholder="Inter" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item name={["branding", "seoTitle"]} label="SEO Title">
                            <Input placeholder="New Business" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item name={["branding", "seoDescription"]} label="SEO Description">
                            <Input.TextArea rows={3} placeholder="An awesome business" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Button type="primary" htmlType="submit">
                Save Business
            </Button>
        </Form>
    );
}