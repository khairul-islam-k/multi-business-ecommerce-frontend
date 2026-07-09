"use client";

import { useSwal } from "@/hooks/use-swal";
import { useWebsiteMutation } from "@/lib/api/hooks/website";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { WebsiteDomainFormValues } from "@/types/website/website";
import { Button, Card, Form, Input, Select, Space, Switch } from "antd";
import { Dispatch, SetStateAction, useState } from "react";


type WebsiteDomainCreateFormProps = {
    websiteId: string;
    setOpenDomainModal: Dispatch<SetStateAction<boolean>>;
};

const defaultValues: WebsiteDomainFormValues = {
    domainType: "SUBDOMAIN",
    domain: "shop.example.com",
    subdomain: "acme",
    isPrimary: true,
    verificationStatus: "PENDING",
    sslStatus: "PENDING",
};

const WebsiteDomainCreateForm = ({
     websiteId,
     setOpenDomainModal }: WebsiteDomainCreateFormProps) => {
    const [form] = Form.useForm<WebsiteDomainFormValues>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const swal = useSwal()

    const { addDomain } = useWebsiteMutation(businessId);

    const domainType = Form.useWatch("domainType", form);

    const handleFinish = async (values: WebsiteDomainFormValues) => {
        const payload: WebsiteDomainFormValues = {
            domainType: values.domainType,
            domain: values.domain?.trim() || "",
            subdomain: values.subdomain?.trim() || "",
            isPrimary: values.isPrimary ?? false,
            verificationStatus: values.verificationStatus,
            sslStatus: values.sslStatus,
        };

        try {
            setIsSubmitting(true);

            const res = await addDomain.mutateAsync({
                websiteId,
                payload
            });

            console.log('res', res);

            swal.success("Domain added successfully.");
            setOpenDomainModal(false);
            form.resetFields();
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card title="Create Website Domain" className="w-full">
            <Form<WebsiteDomainFormValues>
                form={form}
                layout="vertical"
                initialValues={defaultValues}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Domain Type"
                    name="domainType"
                    rules={[
                        {
                            required: true,
                            message: "Please select domain type",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select domain type"
                        options={[
                            {
                                label: "Subdomain",
                                value: "SUBDOMAIN",
                            },
                            {
                                label: "Custom Domain",
                                value: "CUSTOM_DOMAIN",
                            },
                        ]}
                    />
                </Form.Item>

                {domainType === "SUBDOMAIN" ? (
                    <Form.Item
                        label="Subdomain"
                        name="subdomain"
                        rules={[
                            {
                                required: true,
                                message: "Please enter subdomain",
                            },
                        ]}
                    >
                        <Input placeholder="acme" />
                    </Form.Item>
                ) : null}

                <Form.Item
                    label="Domain"
                    name="domain"
                    rules={[
                        {
                            required: true,
                            message: "Please enter domain",
                        },
                    ]}
                >
                    <Input placeholder="shop.example.com" />
                </Form.Item>

                <Form.Item
                    label="Primary Domain"
                    name="isPrimary"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Form.Item
                        label="Verification Status"
                        name="verificationStatus"
                    >
                        <Select
                            placeholder="Select verification status"
                            options={[
                                {
                                    label: "Pending",
                                    value: "PENDING",
                                },
                                {
                                    label: "Verified",
                                    value: "VERIFIED",
                                },
                                {
                                    label: "Failed",
                                    value: "FAILED",
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="SSL Status"
                        name="sslStatus"
                    >
                        <Select
                            placeholder="Select SSL status"
                            options={[
                                {
                                    label: "Pending",
                                    value: "PENDING",
                                },
                                {
                                    label: "Active",
                                    value: "ACTIVE",
                                },
                                {
                                    label: "Failed",
                                    value: "FAILED",
                                },
                            ]}
                        />
                    </Form.Item>
                </div>

                <Space>
                    <Button type="primary" htmlType="submit"
                        loading={isSubmitting}
                    >
                        Add Domain
                    </Button>

                </Space>
            </Form>
        </Card>
    );
};

export default WebsiteDomainCreateForm;