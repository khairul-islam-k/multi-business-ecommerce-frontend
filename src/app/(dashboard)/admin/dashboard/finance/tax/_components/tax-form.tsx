"use client";

import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space } from "antd";
import { useEffect } from "react";

import { TaxPayload, TaxResponse, TaxStatus } from "@/types/finance/tax";

const { TextArea } = Input;

export type TaxFormValues = {
  name: string;
  rate: number;
  description: string;
  status: TaxStatus;
};

type TaxFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<TaxResponse>;
  isSubmitting?: boolean;
  onSubmit: (values: TaxPayload) => void | Promise<void>;
  onCancel?: () => void;
};

const TaxForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TaxFormProps) => {
  const [form] = Form.useForm<TaxFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name ?? "",
        rate: Number(initialValues.rate ?? 0),
        description: initialValues.description ?? "",
        status: initialValues.status ?? "ACTIVE",
      });
    }
  }, [form, initialValues]);

  const handleFinish = (values: TaxFormValues) => {
    const payload: TaxPayload = {
      name: values.name.trim(),
      rate: Number(values.rate),
      description: values.description.trim(),
      status: values.status,
    };

    onSubmit(payload);
  };

  return (
    <Card title={mode === "create" ? "Create Tax" : "Update Tax"}>
      <Form<TaxFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark
        initialValues={{
          name: "",
          rate: 0,
          description: "",
          status: "ACTIVE",
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tax Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Tax name is required",
                },
                {
                  min: 2,
                  message: "Tax name must be at least 2 characters",
                },
              ]}
            >
              <Input placeholder="VAT 5%" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tax Rate Percentage"
              tooltip="Enter the percentage rate. Example: 5 means 5%."
              name="rate"
              rules={[
                {
                  validator: (_, value) => {
                    const rate = Number(value);

                    if (
                      value === undefined ||
                      value === null ||
                      value === ""
                    ) {
                      return Promise.reject(
                        new Error("Tax rate is required"),
                      );
                    }

                    if (Number.isNaN(rate)) {
                      return Promise.reject(
                        new Error("Tax rate percentage must be a number"),
                      );
                    }

                    if (rate < 0) {
                      return Promise.reject(
                        new Error("Tax rate cannot be negative"),
                      );
                    }

                    if (rate > 100) {
                      return Promise.reject(
                        new Error(
                          "Tax rate percentage cannot be more than 100",
                        ),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                className="w-full"
                placeholder="Example: 5"
                addonAfter="%"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Description" name="description">
              <TextArea rows={3} placeholder="Default VAT" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
          </Col>

          <Col xs={24}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                {mode === "create" ? "Create Tax" : "Update Tax"}
              </Button>

              {onCancel && (
                <Button onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TaxForm;
