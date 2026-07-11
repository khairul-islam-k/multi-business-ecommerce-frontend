"use client";

import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useBusiness, useBusinessMutations } from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getApiErrorMessage } from "@/lib/axios";
import {
  defaultDashboardThemeTokens,
  getDashboardThemeTokens,
} from "@/lib/theme/dashboard-theme";

import ImageSelectModal from "../../_components/image-select-modal";

import type { BusinessBranding } from "@/lib/api";

const { Text } = Typography;

type BrandingValues = BusinessBranding;

const colorGroups = [
  {
    title: "Brand Actions",
    fields: [
      ["primaryColor", "Primary"],
      ["primaryHoverColor", "Primary hover"],
      ["primaryActiveColor", "Primary active"],
      ["accentColor", "Accent"],
    ],
  },
  {
    title: "Feedback",
    fields: [
      ["successColor", "Success"],
      ["warningColor", "Warning"],
      ["errorColor", "Error"],
      ["infoColor", "Info"],
    ],
  },
  {
    title: "Dashboard Shell",
    fields: [
      ["dashboardBackgroundColor", "Dashboard background"],
      ["sidebarBackgroundColor", "Sidebar background"],
      ["sidebarTextColor", "Sidebar text"],
      ["sidebarMutedTextColor", "Sidebar muted text"],
      ["sidebarActiveBackgroundColor", "Sidebar active background"],
      ["sidebarActiveTextColor", "Sidebar active text"],
      ["sidebarHoverBackgroundColor", "Sidebar hover background"],
      ["headerBackgroundColor", "Header background"],
      ["headerTextColor", "Header text"],
    ],
  },
  {
    title: "Surfaces",
    fields: [
      ["cardBackgroundColor", "Card background"],
      ["elevatedBackgroundColor", "Elevated background"],
      ["tableHeaderBackgroundColor", "Table header background"],
      ["tableRowHoverColor", "Table row hover"],
      ["inputBackgroundColor", "Input background"],
      ["disabledBackgroundColor", "Disabled background"],
    ],
  },
  {
    title: "Text And Borders",
    fields: [
      ["textPrimaryColor", "Primary text"],
      ["textSecondaryColor", "Secondary text"],
      ["textMutedColor", "Muted text"],
      ["textInverseColor", "Inverse text"],
      ["borderColor", "Border"],
      ["borderSubtleColor", "Subtle border"],
      ["focusRingColor", "Focus ring"],
    ],
  },
] as const;

const fontOptions = [
  {
    label: "Open Sans",
    value: 'var(--font-open-sans), "Open Sans", sans-serif',
  },
  {
    label: "Geist",
    value: 'var(--font-sans), "Geist", sans-serif',
  },
  {
    label: "System UI",
    value:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  { label: "Inter", value: 'Inter, "Segoe UI", sans-serif' },
  { label: "Arial", value: 'Arial, "Helvetica Neue", sans-serif' },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
];

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

    const themeTokens = getDashboardThemeTokens(business.branding);

    form.setFieldsValue({
      logoUrl: business.branding?.logoUrl ?? undefined,
      faviconUrl: business.branding?.faviconUrl ?? undefined,
      primaryColor: themeTokens.primaryColor,
      primaryHoverColor: themeTokens.primaryHoverColor,
      primaryActiveColor: themeTokens.primaryActiveColor,
      accentColor: themeTokens.accentColor,
      successColor: themeTokens.successColor,
      warningColor: themeTokens.warningColor,
      errorColor: themeTokens.errorColor,
      infoColor: themeTokens.infoColor,
      dashboardBackgroundColor: themeTokens.dashboardBackgroundColor,
      sidebarBackgroundColor: themeTokens.sidebarBackgroundColor,
      sidebarTextColor: themeTokens.sidebarTextColor,
      sidebarMutedTextColor: themeTokens.sidebarMutedTextColor,
      sidebarActiveBackgroundColor: themeTokens.sidebarActiveBackgroundColor,
      sidebarActiveTextColor: themeTokens.sidebarActiveTextColor,
      sidebarHoverBackgroundColor: themeTokens.sidebarHoverBackgroundColor,
      headerBackgroundColor: themeTokens.headerBackgroundColor,
      headerTextColor: themeTokens.headerTextColor,
      cardBackgroundColor: themeTokens.cardBackgroundColor,
      elevatedBackgroundColor: themeTokens.elevatedBackgroundColor,
      tableHeaderBackgroundColor: themeTokens.tableHeaderBackgroundColor,
      tableRowHoverColor: themeTokens.tableRowHoverColor,
      inputBackgroundColor: themeTokens.inputBackgroundColor,
      disabledBackgroundColor: themeTokens.disabledBackgroundColor,
      textPrimaryColor: themeTokens.textPrimaryColor,
      textSecondaryColor: themeTokens.textSecondaryColor,
      textMutedColor: themeTokens.textMutedColor,
      textInverseColor: themeTokens.textInverseColor,
      borderColor: themeTokens.borderColor,
      borderSubtleColor: themeTokens.borderSubtleColor,
      focusRingColor: themeTokens.focusRingColor,
      fontFamily: themeTokens.fontFamily,
      borderRadius: themeTokens.borderRadius,
      density: themeTokens.density,
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
        subtitle="Manage the dashboard visual identity, palette, and metadata for the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={!updateAccess.allowed}
      >
        <div className="space-y-4">
          <Card title="Brand Assets">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="logoUrl" label="Logo">
                  <Input readOnly placeholder="/uploads/media/logo.png" />
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
                  <Input readOnly placeholder="/uploads/media/favicon.ico" />
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
                      <span className="text-sm text-gray-400">No Favicon</span>
                    )}
                  </div>

                  <Button block onClick={() => openImageModal("faviconUrl")}>
                    Select Favicon
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          <Card title="SEO">
            <Form.Item name="seoTitle" label="SEO title">
              <Input placeholder="Business title" maxLength={255} />
            </Form.Item>

            <Form.Item name="seoDescription" label="SEO description">
              <Input.TextArea rows={4} placeholder="Short business summary" />
            </Form.Item>
          </Card>

          <Card title="Dashboard Appearance">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="fontFamily" label="Font family">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={fontOptions}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="borderRadius" label="Border radius">
                  <InputNumber min={0} max={24} className="w-full" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="density" label="Density">
                  <Select
                    options={[
                      { label: "Compact", value: "COMPACT" },
                      { label: "Default", value: "DEFAULT" },
                      { label: "Comfortable", value: "COMFORTABLE" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Brand Color Schema">
            <div className="space-y-5">
              {colorGroups.map((group) => (
                <section key={group.title}>
                  <Text strong>{group.title}</Text>
                  <Row gutter={[12, 12]} className="mt-3">
                    {group.fields.map(([name, label]) => (
                      <Col xs={24} sm={12} lg={8} key={name}>
                        <Form.Item name={name} label={label} className="mb-0">
                          <Input type="color" style={{ height: 42 }} />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </section>
              ))}

              <div
                className="rounded-lg border p-5"
                style={{
                  borderColor:
                    watchedValues.borderSubtleColor ??
                    defaultDashboardThemeTokens.borderSubtleColor,
                  background:
                    watchedValues.cardBackgroundColor ??
                    watchedValues.dashboardBackgroundColor ??
                    defaultDashboardThemeTokens.cardBackgroundColor,
                  color:
                    watchedValues.textPrimaryColor ??
                    defaultDashboardThemeTokens.textPrimaryColor,
                  fontFamily: watchedValues.fontFamily ?? undefined,
                  borderRadius:
                    watchedValues.borderRadius ??
                    defaultDashboardThemeTokens.borderRadius,
                }}
              >
                <Text
                  strong
                  style={{
                    color:
                      watchedValues.textPrimaryColor ??
                      defaultDashboardThemeTokens.textPrimaryColor,
                  }}
                >
                  {watchedValues.seoTitle ||
                    business?.name ||
                    "Business preview"}
                </Text>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color:
                      watchedValues.textSecondaryColor ??
                      defaultDashboardThemeTokens.textSecondaryColor,
                  }}
                >
                  {watchedValues.seoDescription ||
                    "Preview how the selected palette will feel across dashboard surfaces."}
                </p>

                <Button
                  className="mt-3"
                  style={{
                    background:
                      watchedValues.primaryColor ??
                      defaultDashboardThemeTokens.primaryColor,
                    borderColor:
                      watchedValues.primaryColor ??
                      defaultDashboardThemeTokens.primaryColor,
                    color:
                      watchedValues.textInverseColor ??
                      defaultDashboardThemeTokens.textInverseColor,
                  }}
                >
                  Accent action
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {updateAccess.allowed && (
          <div className="mt-4 flex justify-end">
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
