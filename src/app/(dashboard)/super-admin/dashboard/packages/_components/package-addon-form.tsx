"use client";

import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect } from "react";

import type { PackageAddon, PackageAddonPayload } from "@/lib/api";
import {
  billingCycleOptions,
  limitKeyOptions,
  optionLabel,
  packageStatusOptions,
  resetCycleOptions,
} from "../_utils/package-options";

type PackageAddonFormProps = {
  initialValue?: PackageAddon | null;
  loading?: boolean;
  onSubmit: (payload: PackageAddonPayload) => void;
};

export default function PackageAddonForm({
  initialValue,
  loading,
  onSubmit,
}: PackageAddonFormProps) {
  const [form] = Form.useForm<PackageAddonPayload>();

  useEffect(() => {
    form.setFieldsValue({
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? undefined,
      price: Number(initialValue?.price ?? 0),
      billingCycle: initialValue?.billingCycle ?? "MONTHLY",
      currencyCode: initialValue?.currencyCode ?? "BDT",
      limitKey: initialValue?.limitKey ?? "MAX_EMPLOYEES",
      limitValue: initialValue?.limitValue ?? 1,
      resetCycle: initialValue?.resetCycle ?? "LIFETIME",
      status: initialValue?.status ?? "ACTIVE",
      sortOrder: initialValue?.sortOrder ?? 0,
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

        <Col xs={24} md={12}>
          <Form.Item name="limitKey" label="Limit" rules={[{ required: true }]}>
            <Select
              options={limitKeyOptions.map((value) => ({
                label: optionLabel(value),
                value,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="limitValue"
            label="Limit value"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="resetCycle" label="Reset cycle">
            <Select
              options={resetCycleOptions.map((value) => ({
                label: optionLabel(value),
                value,
              }))}
            />
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

        <Col xs={24} md={8}>
          <Form.Item name="sortOrder" label="Sort order">
            <InputNumber min={0} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end">
        <Button htmlType="submit" type="primary" loading={loading}>
          {initialValue ? "Update add-on" : "Create add-on"}
        </Button>
      </div>
    </Form>
  );
}
