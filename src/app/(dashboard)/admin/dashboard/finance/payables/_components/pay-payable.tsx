"use client";

import Loader from "@/components/shared/loader";
import { getApiErrorMessage } from "@/lib/axios";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { useFinancePayable, useFinancePayableMutation } from "@/lib/api/hooks/finance-payable-receivable";
import { useAuthStore } from "@/stores/auth.store";
import {
    Button,
    Card,
    Descriptions,
    Empty,
    Form,
    Input,
    InputNumber,
    Select,
} from "antd";
import React, { useMemo, useState } from "react";
import { PayPayableFormValues } from "@/types/finance/payable";
import { useSwal } from "@/hooks/use-swal";
import { FinanceAccountResponse } from "@/types/finance/account";

type PayPayableProps = {
    payableId: string;
    payModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const accountTypeOptions = [
    { label: "Cash", value: "CASH" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "bKash", value: "BKASH" },
    { label: "Nagad", value: "NAGAD" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "Other", value: "OTHER" },
];

const PayPayable = ({ payableId, payModalOpen }: PayPayableProps) => {
    const [form] = Form.useForm<PayPayableFormValues>();
    const swal = useSwal()

    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";

    const { data: accounts, isLoading: accountsLoading } =
        useFinanceAccountQuery(businessId);

    const {
        data: payable,
        isLoading,
        isFetching,
    } = useFinancePayable(businessId, payableId);

    const { updateFinancePayable } = useFinancePayableMutation(businessId);

    const totalAmount = Number(payable?.totalAmount ?? 0);
    const paidAmount = Number(payable?.paidAmount ?? 0);
    const dueAmount = totalAmount - paidAmount;
    const [selectSingleAccount, setSelectSingleAccount] = useState<FinanceAccountResponse>();

    console.log('select', selectSingleAccount);

    const accountOptions = useMemo(() => {
        return (
            accounts?.items?.map((account) => ({
                label: `${account.name} - ${account.accountType}`,
                value: account.id,
            })) ?? []
        );
    }, [accounts]);

    const handleAccountChange = (accountId: string) => {
        const selectedAccount = accounts?.items?.find(
            (account) => account.id === accountId,
        );

        if (selectedAccount?.accountType) {
            setSelectSingleAccount(selectedAccount);
            // form.setFieldValue("paymentMethod", selectedAccount.accountType);
        }
    };

    const handlePay = async (values: PayPayableFormValues) => {
        try {
            const payload = {
                financeAccountId: values.financeAccountId,
                amount: values.amount,
                paymentMethod: values.paymentMethod,
                note: values.note?.trim() || undefined,
            };

            const res = await updateFinancePayable.mutateAsync({
                payableId,
                payload
            })

            console.log('res', res);
            swal.success("Payable paid successfully.");
            form.resetFields();
            payModalOpen(false);
        } catch (error) {
            swal.error(`${getApiErrorMessage(error)} .The ${selectSingleAccount?.name} balance is ${selectSingleAccount?.currentBalance}`);
        }
    };

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (!payable) {
        return <Empty description="Payable not found" />;
    }

    return (
        <div>
            <Card size="small" 
            style={{
                marginBottom: '15px'
            }}
            >
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Total Amount">
                        {totalAmount}
                    </Descriptions.Item>

                    <Descriptions.Item label="Paid Amount">
                        {paidAmount}
                    </Descriptions.Item>

                    <Descriptions.Item label="Due Amount">
                        {dueAmount}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Form<PayPayableFormValues>
                form={form}
                layout="vertical"
                onFinish={handlePay}
                initialValues={{
                    amount: dueAmount,
                    paymentMethod: "CASH",
                }}
            >
                <Form.Item
                    label="Finance Account"
                    name="financeAccountId"
                    rules={[
                        {
                            required: true,
                            message: "Please select finance account",
                        },
                    ]}
                >
                    <Select
                        loading={accountsLoading}
                        placeholder="Select account"
                        options={accountOptions}
                        showSearch
                        optionFilterProp="label"
                        onChange={handleAccountChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please enter amount",
                        },
                        {
                            validator: (_, value) => {
                                if (!value || value <= 0) {
                                    return Promise.reject("Amount must be greater than 0");
                                }

                                if (value > dueAmount) {
                                    return Promise.reject(
                                        "Amount cannot be greater than due amount",
                                    );
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <InputNumber
                        min={1}
                        max={dueAmount}
                        changeOnBlur={false}
                        style={{ width: "100%" }}
                        placeholder="Enter amount"
                    />
                </Form.Item>

                <Form.Item
                    label="Payment Method"
                    name="paymentMethod"
                    rules={[
                        {
                            required: true,
                            message: "Please select payment method",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select payment method"
                        options={accountTypeOptions}
                    />
                </Form.Item>

                <Form.Item label="Note" name="note">
                    <Input.TextArea rows={3} placeholder="Paid supplier invoice" />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={() => payModalOpen(false)}>Cancel</Button>

                    <Button type="primary" htmlType="submit">
                        Pay Now
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default PayPayable;
