"use client";

import { useEffect } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Switch,
} from "antd";
import { CustomerAddressPayload, CustomerAddressType } from "@/types/customer/customerAddress";
import { countryOptions } from "@/lib/business/options";


type CustomerAddressFormValues = {
    addressType: CustomerAddressType;
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    isDefault: boolean;
};

type CustomerAddressInitialData = {
    addressType: CustomerAddressType;
    name?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    isDefault: boolean;
};

type CustomerAddressFormProps = {
    initialData?: CustomerAddressInitialData;
    loading?: boolean;
    onSubmit: (payload: CustomerAddressPayload) => void | Promise<void>;
};

export default function CustomerAddressForm({
    initialData,
    loading = false,
    onSubmit,
}: CustomerAddressFormProps) {
    const [form] = Form.useForm<CustomerAddressFormValues>();

    const isUpdate = Boolean(initialData);

    useEffect(() => {
        if (!initialData) return;

        form.setFieldsValue({
            addressType: initialData.addressType,
            name: initialData.name ?? undefined,
            address: initialData.address ?? undefined,
            city: initialData.city ?? undefined,
            country: initialData.country ?? undefined,
            isDefault: initialData.isDefault,
        });
    }, [initialData, form]);

    const handleFinish = async (values: CustomerAddressFormValues) => {
        const payload: CustomerAddressPayload = {
            addressType: values.addressType,
            name: values.name || undefined,
            address: values.address || undefined,
            city: values.city || undefined,
            country: values.country || undefined,
            isDefault: values.isDefault,
        };

        await onSubmit(payload);
    };

    return (
        <Card title={isUpdate ? "Update Customer Address" : "Create Customer Address"}>
            <Form<CustomerAddressFormValues>
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    addressType: "HOME",
                    country: "Bangladesh",
                    isDefault: false,
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Address Type"
                            name="addressType"
                            rules={[{ required: true, message: "Please select address type" }]}
                        >
                            <Select
                                placeholder="Select address type"
                                options={[
                                    { label: "Home", value: "HOME" },
                                    { label: "Office", value: "OFFICE" },
                                    { label: "Shipping", value: "SHIPPING" },
                                    { label: "Billing", value: "BILLING" },
                                    { label: "Other", value: "OTHER" },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Address Name" name="name">
                            <Input placeholder="Home" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="City" name="city">
                            <Input placeholder="Dhaka" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Country" name="country">
                            <Select
                                showSearch
                                allowClear
                                placeholder="Search and select address type"
                                optionFilterProp="label"
                                options={countryOptions}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Address" name="address">
                            <Input.TextArea
                                rows={4}
                                placeholder="House 10, Road 2, Dhanmondi"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label="Default Address"
                            name="isDefault"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {isUpdate ? "Update Address" : "Create Address"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}