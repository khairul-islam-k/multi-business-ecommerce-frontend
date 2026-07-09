"use client";

import { CircleMinus, CirclePlus } from "lucide-react";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
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

      limits:
        initialValue?.limits?.map((limit) => ({
          limitKey: limit.limitKey,
          limitValue: limit.limitValue,
          resetCycle: limit.resetCycle ?? "LIFETIME",
          description: limit.description ?? undefined,
        })) ?? [],

      features:
        initialValue?.features?.map((feature) => ({
          title: feature.title,
          description: feature.description ?? undefined,
          isActive: feature.isActive ?? true,
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
          <Card
            title="Plan Limits"
            extra={
              <Button
                type="dashed"
                icon={<CirclePlus />}
                onClick={() =>
                  add({
                    limitKey: "",
                    limitValue: 0,
                    resetCycle: "LIFETIME",
                    description: "",
                  })
                }
              >
                Add Limit
              </Button>
            }
          >
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} align="middle">
                <Col xs={24} md={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "limitKey"]}
                    label="Limit Key"
                    rules={[
                      {
                        required: true,
                        message: "Limit key is required",
                      },
                    ]}
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
                    {...restField}
                    name={[name, "limitValue"]}
                    label="Limit Value"
                    rules={[
                      {
                        required: true,
                        message: "Limit value is required",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="10"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={5}>
                  <Form.Item
                    {...restField}
                    name={[name, "resetCycle"]}
                    label="Reset Cycle"
                    rules={[
                      {
                        required: true,
                        message: "Reset cycle is required",
                      },
                    ]}
                  >
                    <Select
                      options={resetCycleOptions.map((value) => ({
                        label: optionLabel(value),
                        value,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Maximum employees allowed" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={2}>
                  <Form.Item label=" ">
                    <Button
                      danger
                      type="text"
                      icon={<CircleMinus />}
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Card>
        )}
      </Form.List>

      <Form.List name="features">
        {(fields, { add, remove }) => (
          <Card
            style={{ marginTop: "20px" }}
            title="Plan Features"
            extra={
              <Button
                type="dashed"
                icon={<CirclePlus />}
                onClick={() =>
                  add({
                    title: "",
                    description: "",
                    isActive: true,
                  })
                }
              >
                Add Feature
              </Button>
            }
          >
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} align="middle">
                <Col xs={24} md={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    label="Feature Title"
                    rules={[
                      {
                        required: true,
                        message: "Feature title is required",
                      },
                    ]}
                  >
                    <Input placeholder="Unlimited products" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={10}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Create as many products as your catalogue needs" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                  <Form.Item
                    {...restField}
                    name={[name, "isActive"]}
                    label="Active"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>

                <Col xs={24} md={2}>
                  <Form.Item label=" ">
                    <Button
                      danger
                      type="text"
                      icon={<CircleMinus />}
                      onClick={() => remove(name)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Card>
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
