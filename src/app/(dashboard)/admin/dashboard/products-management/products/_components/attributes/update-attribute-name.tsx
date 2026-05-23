"use client";

import { useSwal } from "@/hooks/use-swal";
import { useAttributeMutation, useProductAttribute } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { AttributeUpdatePayload, ResponseProductAttribute } from "@/types/product/attribute";
import { Button, Card, Empty, Form, Input, Select, Skeleton } from "antd";
import { useEffect, useMemo, useState } from "react";

type AttributeStatus = "ACTIVE" | "INACTIVE";

// type ProductAttribute = {
//   id: string;
//   name: string;
//   status: AttributeStatus;
// };

type UpdateProps = {
    productId: string;
};

type FormValues = {
    attributeId: string;
    name: string;
    status: AttributeStatus;
};

const UpdateAttributeName = ({ productId }: UpdateProps) => {
    const [form] = Form.useForm<FormValues>();
    const [selectedAttributeId, setSelectedAttributeId] = useState<string>();

    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();

    const {
        data: attributes,
        isLoading,
        isFetching,
    } = useProductAttribute(businessId, productId);

    //   update
    const { updateAttributeName } = useAttributeMutation(businessId);

    const attributeList = (attributes ?? []) as ResponseProductAttribute[];

    const attributeOptions = useMemo(() => {
        return attributeList.map((attribute) => ({
            label: attribute.name,
            value: attribute.id,
        }));
    }, [attributeList]);

    const selectedAttribute = useMemo(() => {
        return attributeList.find(
            (attribute) => attribute.id === selectedAttributeId
        );
    }, [attributeList, selectedAttributeId]);

    useEffect(() => {
        if (!selectedAttribute) return;

        form.setFieldsValue({
            attributeId: selectedAttribute.id,
            name: selectedAttribute.name,
            status: selectedAttribute.status,
        });
    }, [selectedAttribute, form]);

    const handleSubmit = async (values: FormValues) => {
        const payload: AttributeUpdatePayload = {
            name: values.name.trim(),
            status: values.status,
        };

        console.log("Attribute ID:", values.attributeId);
        console.log("Update payload:", payload);

        try {
            const res = await updateAttributeName.mutateAsync({productId, attributeId: values.attributeId, payload});
            swal.success('Attribute Name update successfully');
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        }
    };

    if (isLoading || isFetching) {
        return (
            <Card title="Update Attribute">
                <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
        );
    }

    if (!attributeList.length) {
        return (
            <Card title="Update Attribute">
                <Empty description="No attributes found" />
            </Card>
        );
    }

    return (
        <Card title="Update Attribute">
            <Form<FormValues> form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Select Attribute"
                    name="attributeId"
                    rules={[
                        {
                            required: true,
                            message: "Please select an attribute",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select attribute"
                        options={attributeOptions}
                        optionFilterProp="label"
                        onChange={(value) => {
                            setSelectedAttributeId(value);
                        }}
                    />
                </Form.Item>

                {selectedAttribute ? (
                    <>
                        <Form.Item
                            label="Change Attribute Name"
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

                        <Button type="primary" htmlType="submit">
                            Update Attribute
                        </Button>
                    </>
                ) : null}
            </Form>
        </Card>
    );
};

export default UpdateAttributeName;