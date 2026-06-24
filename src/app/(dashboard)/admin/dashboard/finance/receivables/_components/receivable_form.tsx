"use client";

import Loader from "@/components/shared/loader";
import { getApiErrorMessage } from "@/lib/axios";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import {
  useFinanceReceivable,
  useFinanceReceivableMutation,
} from "@/lib/api/hooks/finance-payable-receivable";
import { useSwal } from "@/hooks/use-swal";
import { useAuthStore } from "@/stores/auth.store";
import { FinanceAccountResponse } from "@/types/finance/account";
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

type ReceiveReceivableProps = {
  receivableId: string;
  receiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type ReceiveReceivableFormValues = {
  financeAccountId: string;
  amount: number;
  note?: string;
};

const ReceiveReceivable = ({
  receivableId,
  receiveModalOpen,
}: ReceiveReceivableProps) => {
  const [form] = Form.useForm<ReceiveReceivableFormValues>();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [selectSingleAccount, setSelectSingleAccount] =
    useState<FinanceAccountResponse>();

  const { data: accounts, isLoading: accountsLoading } =
    useFinanceAccountQuery(businessId);

  const {
    data: receivable,
    isLoading,
    isFetching,
  } = useFinanceReceivable(businessId, receivableId);


  const { updateFinanceReceivable } = useFinanceReceivableMutation(businessId);

  const totalAmount = Number(receivable?.totalAmount ?? 0);
  const receivedAmount = Number(receivable?.receivedAmount ?? 0);
  const dueAmount = totalAmount - receivedAmount;

  const accountOptions = useMemo(() => {
    return (
      accounts?.items?.map((account) => ({
        label: `${account.name} - ${account.accountType}`,
        value: account.id,
      })) ?? []
    );
  }, [accounts?.items]);

  const handleAccountChange = (accountId: string) => {
    const selectedAccount = accounts?.items?.find(
      (account) => account.id === accountId,
    );

    if (selectedAccount) {
      setSelectSingleAccount(selectedAccount);
    }
  };

  const handleReceive = async (values: ReceiveReceivableFormValues) => {
    try {
      const payload = {
        financeAccountId: values.financeAccountId,
        amount: values.amount,
        note: values.note?.trim() || undefined,
      };

      await updateFinanceReceivable.mutateAsync({
        receivableId,
        payload,
      });

      swal.success("Receivable received successfully.");
      form.resetFields();
      receiveModalOpen(false);
    } catch (error) {
      swal.error(
        `${getApiErrorMessage(error)}. The ${selectSingleAccount?.name ?? "selected account"
        } balance is ${selectSingleAccount?.currentBalance ?? 0}`,
      );
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!receivable) {
    return <Empty description="Receivable not found" />;
  }

  return (
    <div>
      <Card
        size="small"
        style={{
          marginBottom: "15px",
        }}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Total Amount">
            {totalAmount}
          </Descriptions.Item>

          <Descriptions.Item label="Received Amount">
            {receivedAmount}
          </Descriptions.Item>

          <Descriptions.Item label="Due Amount">
            {dueAmount}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Form<ReceiveReceivableFormValues>
        form={form}
        layout="vertical"
        onFinish={handleReceive}
        initialValues={{
          amount: dueAmount,
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

        <Form.Item label="Note" name="note">
          <Input.TextArea
            rows={3}
            placeholder="Received supplier return refund"
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={() => receiveModalOpen(false)}>Cancel</Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={updateFinanceReceivable.isPending}
          >
            Receive Now
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReceiveReceivable;
