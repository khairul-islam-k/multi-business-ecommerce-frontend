"use client";

import { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";

import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useBusiness, useBusinessMutations } from "@/lib/api";
import type { BusinessBranding } from "@/lib/api";

const { Text } = Typography;

type BrandingValues = BusinessBranding;

const colorFields = [
  ["primaryColor", "Primary color"],
  ["secondaryColor", "Secondary color"],
  ["accentColor", "Accent color"],
] as const;

export default function BusinessBrandingPage() {
  const [form] = Form.useForm<BrandingValues>();
  const swal = useSwal();
  const businessId = useActiveBusinessId();
  const { data: business, isLoading } = useBusiness(businessId ?? undefined);
  const { updateBusiness } = useBusinessMutations();
  const watchedValues = Form.useWatch([], form) ?? {};

  useEffect(() => {
    if (!business) return;

    form.setFieldsValue({
      logoUrl: business.branding?.logoUrl ?? undefined,
      faviconUrl: business.branding?.faviconUrl ?? undefined,
      primaryColor: business.branding?.primaryColor ?? "#0f766e",
      secondaryColor: business.branding?.secondaryColor ?? "#f8fafc",
      accentColor: business.branding?.accentColor ?? "#f59e0b",
      fontFamily: business.branding?.fontFamily ?? "Inter",
      seoTitle: business.branding?.seoTitle ?? business.name,
      seoDescription: business.branding?.seoDescription ?? undefined,
    });
  }, [business, form]);

  const onFinish = async (values: BrandingValues) => {
    if (!businessId) return;

    try {
      await updateBusiness.mutateAsync({
        businessId,
        payload: {
          branding: values,
        },
      });

      swal.success("Branding settings saved.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Branding"
        subtitle="Brand assets and SEO metadata are saved against the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card title="Brand Assets">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="logoUrl" label="Logo URL">
                    <Input placeholder="https://example.com/logo.png" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="faviconUrl" label="Favicon URL">
                    <Input placeholder="https://example.com/favicon.ico" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="fontFamily" label="Font family">
                    <Input placeholder="Inter" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="SEO" className="mt-4">
              <Form.Item name="seoTitle" label="SEO title">
                <Input placeholder="Business title" maxLength={255} />
              </Form.Item>
              <Form.Item name="seoDescription" label="SEO description">
                <Input.TextArea
                  rows={4}
                  placeholder="Short store description"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="Brand Palette">
              <Space direction="vertical" size={16} className="w-full">
                {colorFields.map(([name, label]) => (
                  <Form.Item
                    key={name}
                    name={name}
                    label={label}
                    className="mb-0"
                  >
                    <Input type="color" style={{ height: 42 }} />
                  </Form.Item>
                ))}
              </Space>

              <div
                className="mt-6 rounded-lg border p-5"
                style={{
                  borderColor: watchedValues.secondaryColor ?? "#e5e7eb",
                  background: watchedValues.secondaryColor ?? "#f8fafc",
                }}
              >
                <Text
                  strong
                  style={{ color: watchedValues.primaryColor ?? "#0f766e" }}
                >
                  {watchedValues.seoTitle ||
                    business?.name ||
                    "Business preview"}
                </Text>
                <p
                  className="mt-2 text-sm"
                  style={{ color: watchedValues.primaryColor ?? "#0f766e" }}
                >
                  {watchedValues.seoDescription ||
                    "Preview how the selected palette may feel across storefront surfaces."}
                </p>
                <Button
                  className="mt-3"
                  style={{
                    background: watchedValues.accentColor ?? "#f59e0b",
                    borderColor: watchedValues.accentColor ?? "#f59e0b",
                    color: "#111827",
                  }}
                >
                  Accent action
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="mt-4 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateBusiness.isPending}
          >
            Save branding
          </Button>
        </div>
      </Form>
    </div>
  );
}
