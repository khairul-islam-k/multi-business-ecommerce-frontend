"use client";

import { Button, Form, Select } from "antd";
import { useEffect } from "react";

import type { ApiId, PackagePlan, Tenant } from "@/lib/api";

type SubscriptionFormValues = {
  tenantId?: ApiId;
  planId: ApiId;
};

type SubscriptionFormProps = {
  tenants?: Tenant[];
  plans?: PackagePlan[];
  loading?: boolean;
  showTenant?: boolean;
  onSubmit: (values: SubscriptionFormValues) => void;
};

export default function SubscriptionForm({
  tenants = [],
  plans = [],
  loading,
  showTenant = true,
  onSubmit,
}: SubscriptionFormProps) {
  const [form] = Form.useForm<SubscriptionFormValues>();

  useEffect(() => {
    form.resetFields();
  }, [form, showTenant]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {showTenant && (
        <Form.Item name="tenantId" label="Tenant" rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="label"
            options={tenants.map((tenant) => ({
              label: `${tenant.name} (${tenant.email})`,
              value: tenant.id,
            }))}
          />
        </Form.Item>
      )}

      <Form.Item name="planId" label="Plan" rules={[{ required: true }]}>
        <Select
          showSearch
          optionFilterProp="label"
          options={plans.map((plan) => ({
            label: `${plan.name} - ${plan.currencyCode} ${plan.price}`,
            value: plan.id,
          }))}
        />
      </Form.Item>

      <div className="flex justify-end">
        <Button htmlType="submit" type="primary" loading={loading}>
          {showTenant ? "Create subscription" : "Change plan"}
        </Button>
      </div>
    </Form>
  );
}
