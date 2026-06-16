"use client";

import { useExpenseCategoryQuery } from "@/lib/api/hooks/expense-category";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { useAuthStore } from "@/stores/auth.store";
import { ExpensePayload, ExpenseResponse } from "@/types/stock/expense";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo } from "react";

const { TextArea } = Input;

type SelectOption = {
    label: string;
    value: string;
};

type ExpenseFormValues = {
    accountId: string;
    expenseCategoryId: string;
    title: string;
    amount: number;
    expenseDate: Dayjs;
    note?: string;
};

type ExpenseFormProps = {
    initialData?: ExpenseResponse | undefined;
    loading?: boolean;
    onSubmit: (payload: ExpensePayload) => void | Promise<void>;
};

export default function ExpenseForm({
    initialData,
    loading = false,
    onSubmit,
}: ExpenseFormProps) {
    const isUpdate = Boolean(initialData);
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const [form] = Form.useForm<ExpenseFormValues>();

    const {
        data: accounts,
        isLoading: warehouseLoading,
        isFetching: warehouseFetching,
    } = useFinanceAccountQuery(businessId, {
        status: "ACTIVE"
    });

    const {
        data: expenseCategories,
        isLoading: categoryLoading,
        isFetching: categoryFetching,
    } = useExpenseCategoryQuery(businessId, {
        status: "ACTIVE"
    });

    const accountOptions: SelectOption[] = useMemo(() => {
        return (
            accounts?.items?.map((product) => ({
                label: product.name,
                value: product.id,
            })) ?? []
        );
    }, [accounts?.items]);

    const categoryOptions: SelectOption[] = useMemo(() => {
        return (
            expenseCategories?.items?.map((product) => ({
                label: product.name,
                value: product.id,
            })) ?? []
        );
    }, [expenseCategories?.items]);

    const handleFinish = async (values: ExpenseFormValues) => {
        const payload: ExpensePayload = {
            accountId: values.accountId,
            expenseCategoryId: values.expenseCategoryId,
            title: values.title,
            amount: values.amount,
            expenseDate: values.expenseDate.toISOString(),
            note: values.note,
        };

        await onSubmit(payload);
    };

    useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        accountId: initialData.accountId,
        expenseCategoryId: initialData.expenseCategoryId,
        title: initialData.title,
        amount: Number(initialData.amount),
        expenseDate: dayjs(initialData.expenseDate),
        note: initialData.note ?? undefined,
      });
    }
  }, [initialData, form]);

    return (
        <Card title={isUpdate ? "Update Expense" : "Create Expense"}>
            <Form<ExpenseFormValues>
                layout="vertical"
                onFinish={handleFinish}
                form={form}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Account"
                            name="accountId"
                            rules={[{ required: true, message: "Please select account" }]}
                        >
                            <Select
                                allowClear
                                showSearch
                                loading={warehouseLoading || warehouseFetching}
                                placeholder="Select from warehouse"
                                optionFilterProp="label"
                                options={accountOptions}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Expense Category"
                            name="expenseCategoryId"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select expense category",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                loading={categoryLoading || categoryFetching}
                                placeholder="Select from warehouse"
                                optionFilterProp="label"
                                options={categoryOptions}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter title" }]}
                        >
                            <Input placeholder="Packaging materials" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true, message: "Please enter amount" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="500"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Expense Date"
                            name="expenseDate"
                            rules={[
                                { required: true, message: "Please select expense date" },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24}>
                        <Form.Item label="Note" name="note">
                            <TextArea rows={4} placeholder="Paid to local vendor" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {isUpdate ? "Update Expense" : "Create Expense"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}