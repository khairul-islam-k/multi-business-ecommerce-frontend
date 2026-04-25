"use client";

import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Button, Card, Form, Input, Space, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwal } from "@/hooks/use-swal";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/searchable-select";

export default function EditWebsite() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const router = useRouter();
  const swal = useSwal();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: async () => {
      const res = await api.get(`/websites/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      subdomain: data.subdomain,
      tenant_id: data.tenant_id,
      company_id: data.company_id,
      template_id: data.template_id,
    });
  }, [data]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      await api.patch(`/websites/${id}`, values);

      swal.success("Website updated");
      router.push("/admin/dashboard/website-builder/websites");
    } catch (e) {
      swal.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spin />;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Website" breadcrumb={adminBreadcrumb} />

      <Card className="w-full">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Website Name">
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug">
            <Input />
          </Form.Item>

          <Form.Item name="domain" label="Domain">
            <Input />
          </Form.Item>

          <Form.Item name="subdomain" label="Subdomain">
            <Input addonAfter=".yourdomain.com" />
          </Form.Item>

          {/* COMPANY */}
          <Form.Item name="company_id" label="Company">
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
            <Button onClick={() => router.back()}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
