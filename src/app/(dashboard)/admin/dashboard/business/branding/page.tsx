"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useBusiness, useBusinessMutations } from "@/lib/api";
import type { BusinessBranding } from "@/lib/api";
import Loader from "@/components/shared/loader";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";
import ImageSelectModal from "../../_components/ImageSelectModal";

const { Text } = Typography;

type BrandingValues = BusinessBranding;

const colorFields = [
  ["primaryColor", "Primary color"],
  ["secondaryColor", "Secondary color"],
  ["accentColor", "Accent color"],
] as const;

const imageUrlSet = (url?: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  return `${baseUrl}${url}`;
};

export default function BusinessBrandingPage() {
  const [form] = Form.useForm<BrandingValues>();
  const { message } = App.useApp();
  const businessId = useActiveBusinessId();
  const { data: business, isLoading } = useBusiness(businessId ?? undefined);
  const { updateBusiness } = useBusinessMutations();
  const watchedValues = Form.useWatch([], form) ?? {};
  const updateAccess = usePermissionAccess(PERMISSIONS.businessUpdate);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState<
    "logoUrl" | "faviconUrl" | null
  >(null);

  const logoUrl = Form.useWatch("logoUrl", form);
  const faviconUrl = Form.useWatch("faviconUrl", form);

  const selectedImageUrl =
    activeImageField === "logoUrl"
      ? logoUrl
      : activeImageField === "faviconUrl"
        ? faviconUrl
        : undefined;

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

  const openImageModal = (field: "logoUrl" | "faviconUrl") => {
    setActiveImageField(field);
    setImageModalOpen(true);
  };

  const handleSelectImage = (url: string) => {
    if (!activeImageField) return;

    form.setFieldValue(activeImageField, url);
    setImageModalOpen(false);
    setActiveImageField(null);
  };

  const onFinish = async (values: BrandingValues) => {
    if (!businessId) return;

    try {
      await updateBusiness.mutateAsync({
        businessId,
        payload: {
          branding: values,
        },
      });

      message.success("Branding settings saved.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (isLoading) {
    return (
      <Loader
        label="Loading branding"
        description="Fetching the active business brand settings."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Branding"
        subtitle="Manage visual identity, palette, and store metadata for the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={!updateAccess.allowed}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card title="Brand Assets">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="logoUrl" label="Logo">
                    <Input
                      readOnly
                      placeholder="/uploads/media/logo.png" />
                  </Form.Item>

                  <div className="mb-4 rounded-lg border bg-gray-50 p-3">
                    <div className="mb-3 flex h-[120px] items-center justify-center overflow-hidden rounded-md border bg-white">
                      {logoUrl ? (
                        <Image
                          src={imageUrlSet(logoUrl)}
                          alt="Logo"
                          width={160}
                          height={120}
                          className="max-h-full max-w-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No Logo</span>
                      )}
                    </div>

                    <Button block onClick={() => openImageModal("logoUrl")}>
                      Select Logo
                    </Button>
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="faviconUrl" label="Favicon">
                    <Input
                      readOnly
                      placeholder="/uploads/media/favicon.ico" />
                  </Form.Item>

                  <div className="mb-4 rounded-lg border bg-gray-50 p-3">
                    <div className="mb-3 flex h-[120px] items-center justify-center overflow-hidden rounded-md border bg-white">
                      {faviconUrl ? (
                        <Image
                          src={imageUrlSet(faviconUrl)}
                          alt="Favicon"
                          width={80}
                          height={80}
                          className="max-h-full max-w-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          No Favicon
                        </span>
                      )}
                    </div>

                    <Button
                      block
                      onClick={() => openImageModal("faviconUrl")}
                    >
                      Select Favicon
                    </Button>
                  </div>
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

        {updateAccess.allowed && (
          <div className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={updateBusiness.isPending}
            >
              Save branding
            </Button>
          </div>
        )}
      </Form>

      <ImageSelectModal
        open={imageModalOpen}
        selectedUrl={selectedImageUrl ?? undefined}
        onClose={() => {
          setImageModalOpen(false);
          setActiveImageField(null);
        }}
        onSelect={handleSelectImage}
      />
    </div>
  );
}