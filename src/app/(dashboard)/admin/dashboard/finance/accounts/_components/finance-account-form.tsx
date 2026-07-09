"use client";

import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import type { FinanceAccountPayload } from "@/types/finance/account";
import { currencyOptions } from "@/lib/business/options";

type FinanceAccountFormProps = {
  initialValues?: Partial<FinanceAccountPayload>;
  loading?: boolean;
  submitText: string;
  onSubmit: (values: FinanceAccountPayload) => void | Promise<void>;
};

const accountTypeOptions = [
  { label: "Cash", value: "CASH" },
  { label: "Bank", value: "BANK" },
  { label: "Mobile Banking", value: "MOBILE_BANKING" },
  { label: "Payment Gateway", value: "PAYMENT_GATEWAY" },
  { label: "Other", value: "OTHER" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const defaultValues: FinanceAccountPayload = {
  name: "",
  accountType: "CASH",
  accountNumber: "",
  currencyCode: "BDT",
  openingBalance: 0,
  status: "ACTIVE",
};

const FinanceAccountForm = ({
  initialValues,
  loading,
  submitText,
  onSubmit,
}: FinanceAccountFormProps) => {
  const [form] = Form.useForm<FinanceAccountPayload>();

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...defaultValues,
          ...initialValues,
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Account Name"
              name="name"
              rules={[{ required: true, message: "Account name is required" }]}
            >
              <Input placeholder="Enter account name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Account Type"
              name="accountType"
              rules={[{ required: true, message: "Account type is required" }]}
            >
              <Select
                placeholder="Select account type"
                options={accountTypeOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Account Number"
              name="accountNumber"
              rules={[
                { required: true, message: "Account number is required" },
              ]}
            >
              <Input placeholder="Enter account number" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Currency Code"
              name="currencyCode"
              rules={[{ required: true, message: "Currency code is required" }]}
            >
              <Select
                showSearch
                placeholder="Select account type"
                options={currencyOptions}
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          {
            !(submitText === "Update Account") &&
            <Col xs={24} md={12}>
              <Form.Item
                label="Opening balance amount"
                tooltip="Enter the starting balance in the selected account currency."
                name="openingBalance"
                rules={[
                  { required: true, message: "Opening balance is required" },
                  {
                    type: "number",
                    min: 0,
                    message:
                      "Opening balance must be a non-negative numeric amount",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  min={0}
                  precision={2}
                  className="w-full"
                  placeholder="Example: 0"
                />
              </Form.Item>
            </Col>
          }


          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select placeholder="Select status" options={statusOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Button htmlType="submit" type="primary" loading={loading}>
          {submitText}
        </Button>
      </Form>
    </Card>
  );
};

export default FinanceAccountForm;
