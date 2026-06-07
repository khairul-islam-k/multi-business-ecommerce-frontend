"use client";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Empty, Modal, Popconfirm, Tag } from "antd";
import React, { useState } from "react";
import AttributeValueForm from "./attribute-value-form";
import { AttributeValuePayload } from "./attributes-page";
import { useAuthStore } from "@/stores/auth.store";
import { useAttribute, useAttributeMutation } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { ApiId } from "@/lib/api";

type ViewAttributeProps = {
    attributeId: ApiId
};

const ViewAttribute = ({
    attributeId
}: ViewAttributeProps) => {
    const { message } = App.useApp();
    // modal
    const [valueModal, setValueModal] = useState<boolean>(false);
    const [valueMode, setValueMode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<AttributeValuePayload>({
        value: ''
    });
    const [valueId, setValueId] = useState<string>('');

    // api
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';

    // get attribute
    const { data: viewAttribute, isLoading, isFetching } = useAttribute(businessId, attributeId);

    const { createAttributeValue, updateAttributeValue, removeAttributeValue } = useAttributeMutation(businessId);


    const handleCreate = async (value: AttributeValuePayload) => {
        console.log('value', value);
        setIsSubmitting(true);
        if (!viewAttribute?.id) return;
        const payload = {
            value: value?.value || ''
        }
        try {
            await createAttributeValue.mutateAsync({
                attributeId: viewAttribute?.id,
                payload
            })
            message.success("Attribute Value Created successfully");
        } catch (error) {
            message.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
            setValueModal(false);
        }
    }

    const handleUpdate = async (value: AttributeValuePayload) => {
        setIsSubmitting(true);
        if (!viewAttribute?.id) return;
        const payload = {
            value: value?.value || ''
        }
        try {
            await updateAttributeValue.mutateAsync({
                attributeId: viewAttribute?.id,
                valueId,
                payload
            })
            message.success("Attribute Value Updated successfully");
        } catch (error) {
            message.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
            setValueModal(false);
        }
    }

    const handleDeleteValue = async (valueId: string) => {
        if (!viewAttribute?.id) return;
        try {
            await removeAttributeValue.mutateAsync({
                attributeId: viewAttribute?.id,
                valueId
            })
            message.success("Attribute Value Deleted successfully");
        } catch (error) {
            message.error(getApiErrorMessage(error));
        }
    }

    if (isLoading || isFetching) {
        return (
            <Card>
                <Empty description="Attribute not found" />
            </Card>
        );
    }

    return (
        <div className="space-y-4">

            View modal
            <Card
                title="Attribute Details"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setValueModal(true);
                            setValueMode("create");
                        }}
                    >
                        Add Value
                    </Button>
                }
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoItem label="Attribute Name" value={viewAttribute?.name} />

                    <InfoItem
                        label="Status"
                        value={
                            <Tag color={viewAttribute?.status === "ACTIVE" ? "green" : "red"}>
                                {viewAttribute?.status}
                            </Tag>
                        }
                    />

                    <InfoItem
                        label="Total Values"
                        value={viewAttribute?.values?.length ?? 0}
                    />

                    <InfoItem
                        label="Created At"
                        value={
                            viewAttribute?.createdAt
                                ? new Date(viewAttribute.createdAt).toLocaleDateString()
                                : "-"
                        }
                    />
                </div>
            </Card>

            <Card title="Attribute Values">
                {viewAttribute?.values?.length ? (
                    <div className="space-y-3">
                        {viewAttribute.values.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
                            >
                                <div>
                                    <p className="m-0 font-medium">{item.value}</p>
                                    <p className="m-0 text-xs text-gray-500">
                                        Created: {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setValueModal(true);
                                            setValueMode("update");
                                            setInitialValues({ value: item.value })
                                            setValueId(item.id);
                                        }}
                                    />

                                    <Popconfirm
                                        title="Delete value?"
                                        description="Are you sure?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => handleDeleteValue(item.id)}
                                    >
                                        <Button danger size="small" icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No attribute values found" />
                )}
            </Card>

            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={valueModal}
                footer={null}
                onCancel={() => setValueModal(false)}
            >
                {
                    valueMode === "create" && <AttributeValueForm
                        mode={valueMode}
                        onSubmit={handleCreate}
                        isSubmitting={isSubmitting}
                    />
                }
                {
                    valueMode === "update" && <AttributeValueForm
                        mode={valueMode}
                        onSubmit={handleUpdate}
                        isSubmitting={isSubmitting}
                        initialValues={initialValues}
                    />
                }
            </Modal>
        </div>
    );
};

export default ViewAttribute;

type InfoItemProps = {
    label: string;
    value: React.ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
    return (
        <div className="rounded-lg border bg-gray-50 p-4">
            <p className="mb-1 text-sm text-gray-500">{label}</p>
            <div className="font-medium">{value}</div>
        </div>
    );
};