"use client";

import { useAttributeMutation } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { AttributeUpdatePayload } from "@/types/product/attribute";
import { App, Button, Card, Form, Input, Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UpdateAttributeName } from "../page";


type CreateAttributesPageProps = {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    initialValue: UpdateAttributeName | undefined;
};

const UpdateAttributesPage = ({ setIsModalOpen, initialValue }: CreateAttributesPageProps) => {
    const [form] = Form.useForm<AttributeUpdatePayload>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { message } = App.useApp();

    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';

    const { updateAttributeName } = useAttributeMutation(businessId);

    const handleSubmit = async (values: AttributeUpdatePayload) => {
        setIsSubmitting(true)
        const payload: AttributeUpdatePayload = {
            name: values.name.trim(),
            status: values.status,
        };

        if (!initialValue?.id) return;

        try {
            console.log('payload', payload);
            updateAttributeName.mutateAsync({
                attributeId: initialValue?.id,
                payload
            })
            message.success("Attribute Created successfully");
            setIsModalOpen(false);
        } catch (error) {
            message.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }

    };

    useEffect(() => {
        if (initialValue) {
            form.setFieldsValue({
                name: initialValue.name || "",
                status: initialValue.status || "ACTIVE",
            });
        }
    }, [initialValue, form])

    return (
        <Card title="Update Product Attribute">
            <Form<AttributeUpdatePayload>
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            // initialValues={initialValue}
            >
                <Form.Item
                    label="Attribute Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Attribute name is required",
                        },
                    ]}
                >
                    <Input placeholder="Color" />
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

                <Form.Item className="mb-0 mt-6">
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        Update Attribute
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UpdateAttributesPage;