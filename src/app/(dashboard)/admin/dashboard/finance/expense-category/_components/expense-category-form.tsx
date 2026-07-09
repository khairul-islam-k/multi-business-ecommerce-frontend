"use client";

import React, { useEffect } from "react";
import { Button, Card, Form, FormInstance, Input, Select } from "antd";
import { ExpenseCategoryPayload } from "@/types/stock/expense-category";


type ExpenseCategoryProps = {
    mode: string;
    loading?: boolean;
    initialValues?: ExpenseCategoryPayload;
    onSubmit?: (
        values: ExpenseCategoryPayload,
        form: FormInstance<ExpenseCategoryPayload>
    ) => void | Promise<void>;
};

const defaultValues: ExpenseCategoryPayload = {
    name: "",
    description: "",
    status: "ACTIVE",
};

const ExpenseCategoryForm = ({
    mode,
    loading,
    initialValues,
    onSubmit,
}: ExpenseCategoryProps) => {
    const [form] = Form.useForm<ExpenseCategoryPayload>();

    useEffect(() => {
        form.setFieldsValue(initialValues || defaultValues);
    }, [form, initialValues]);

    const handleFinish = (values: ExpenseCategoryPayload) => {
        onSubmit?.(values, form);
    };

    return (
        <Card title={mode ==='create' ? "View Expense Category" : "Expense Category"}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={initialValues || defaultValues}

            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter expense category name",
                        },
                    ]}
                >
                    <Input placeholder="Office Rent" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={4} placeholder="Monthly office rent" />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "Please select status",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select status"
                        options={[
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ]}
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>

            </Form>
        </Card>
    );
};

export default ExpenseCategoryForm;