"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useEffect } from "react";

import type { PackagePlan, PackagePlanPayload } from "@/lib/api";
import {
  billingCycleOptions,
  limitKeyOptions,
  optionLabel,
  packageStatusOptions,
  resetCycleOptions,
} from "../_utils/package-options";

type PackagePlanFormProps = {
  initialValue?: PackagePlan | null;
  loading?: boolean;
  onSubmit: (payload: PackagePlanPayload) => void;
};

export default function PackagePlanForm({
  initialValue,
  loading,
  onSubmit,
}: PackagePlanFormProps) {
  const [form] = Form.useForm<PackagePlanPayload>();

  useEffect(() => {
    form.setFieldsValue({
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? undefined,
      price: Number(initialValue?.price ?? 0),
      billingCycle: initialValue?.billingCycle ?? "MONTHLY",
      currencyCode: initialValue?.currencyCode ?? "BDT",
      freeTrialDays: initialValue?.freeTrialDays ?? 0,
      isDefault: initialValue?.isDefault ?? false,
      status: initialValue?.status ?? "ACTIVE",
      sortOrder: initialValue?.sortOrder ?? 0,
      limits:
        initialValue?.limits?.map((limit) => ({
          limitKey: limit.limitKey,
          limitValue: limit.limitValue,
          resetCycle: limit.resetCycle ?? "LIFETIME",
          description: limit.description ?? undefined,
        })) ?? [],
    });
  }, [form, initialValue]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input maxLength={150} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="billingCycle"
            label="Billing cycle"
            rules={[{ required: true }]}
          >
            <Select
              options={billingCycleOptions.map((value) => ({
                label: optionLabel(value),
                value,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="currencyCode" label="Currency">
            <Input maxLength={10} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="freeTrialDays" label="Free trial days">
            <InputNumber min={0} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="sortOrder" label="Sort order">
            <InputNumber min={0} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="status" label="Status">
            <Select
              options={packageStatusOptions.map((value) => ({
                label: optionLabel(value),
                value,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Default plan</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Form.List name="limits">
        {(fields, { add, remove }) => (
          <div className="space-y-3">
            {fields.map((field) => (
              <Row gutter={12} key={field.key} align="middle">
                <Col xs={24} md={6}>
                  <Form.Item
                    {...field}
                    name={[field.name, "limitKey"]}
                    label="Limit"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={limitKeyOptions.map((value) => ({
                        label: optionLabel(value),
                        value,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, "limitValue"]}
                    label="Value"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      precision={0}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, "resetCycle"]}
                    label="Reset"
                  >
                    <Select
                      options={resetCycleOptions.map((value) => ({
                        label: optionLabel(value),
                        value,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={20} md={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, "description"]}
                    label="Description"
                  >
                    <Input maxLength={255} />
                  </Form.Item>
                </Col>

                <Col xs={4} md={1}>
                  <Button
                    danger
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(field.name)}
                  />
                </Col>
              </Row>
            ))}

            <Button icon={<PlusOutlined />} onClick={() => add()}>
              Add limit
            </Button>
          </div>
        )}
      </Form.List>

      <div className="mt-6 flex justify-end">
        <Button htmlType="submit" type="primary" loading={loading}>
          {initialValue ? "Update plan" : "Create plan"}
        </Button>
      </div>
    </Form>
  );
}
