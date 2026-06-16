"use client";

import { TaxPayload, TaxResponse, TaxStatus } from "@/types/finance/tax";
import { Button, Card, Form, Input, InputNumber, Select, Space } from "antd";
import { useEffect } from "react";

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
        requiredMark={true}
        initialValues={{
          name: "",
          rate: 0,
          description: "",
          status: "ACTIVE",
        }}
      >
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

        <Form.Item
          label="Rate"
          name="rate"
          className="w-full"
          rules={[
            {
              validator: (_, value) => {
                const rate = Number(value);

                if (value === undefined || value === null || value === "") {
                  return Promise.reject(new Error("Tax rate is required"));
                }

                if (Number.isNaN(rate)) {
                  return Promise.reject(new Error("Tax rate must be a number"));
                }

                if (rate < 0) {
                  return Promise.reject(new Error("Tax rate cannot be negative"));
                }

                if (rate > 100) {
                  return Promise.reject(
                    new Error("Tax rate cannot be more than 100")
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
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          // rules={[
          //   {
          //     required: true,
          //     message: "Description is required",
          //   },
          //   {
          //     min: 3,
          //     message: "Description must be at least 3 characters",
          //   },
          // ]}
        >
          <TextArea rows={3} placeholder="Default VAT" />
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

        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === "create" ? "Create Tax" : "Update Tax"}
          </Button>

          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default TaxForm;