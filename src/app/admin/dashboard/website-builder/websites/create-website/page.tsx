"use client";

import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Button, Card, Form, Input, Space } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSwal } from "@/hooks/use-swal";
import SearchableSelect from "@/components/shared/searchable-select";

export default function CreateWebsite() {
  const [form] = Form.useForm();
  const router = useRouter();
  const swal = useSwal();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      await api.post("/websites", {
        tenant_id: values.tenant_id,
        company_id: values.company_id,
        name: values.name,
        slug: values.slug,
        domain: values.domain,
        subdomain: values.subdomain,
        template_id: values.template_id,
        status: "Active",
      });

      swal.success("Website created");
      router.push("/admin/dashboard/website-builder/websites");
    } catch (e) {
      swal.error("Failed to create website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create Website" breadcrumb={adminBreadcrumb} />

      <Card style={{ maxWidth: 700 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Website Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="domain" label="Domain">
            <Input />
          </Form.Item>

          <Form.Item name="subdomain" label="Subdomain">
            <Input addonAfter=".yourdomain.com" />
          </Form.Item>

          {/* COMPANY */}
          <Form.Item
            name="company_id"
            label="Company"
            rules={[{ required: true }]}
          >
            <SearchableSelect
              endpoint="/companies"
              value={form.getFieldValue("company_id")}
              onChange={(v) => form.setFieldsValue({ company_id: v })}
            />
          </Form.Item>

          {/* TEMPLATE */}
          <Form.Item name="template_id" label="Template">
            <SearchableSelect
              endpoint="/website-templates"
              value={form.getFieldValue("template_id")}
              onChange={(v) => form.setFieldsValue({ template_id: v })}
            />
          </Form.Item>

          <Space>
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Website
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
