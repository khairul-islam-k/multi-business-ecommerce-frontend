"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useBusiness, useBusinessMutations } from "@/lib/api";
import type { BusinessPayload } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

type BusinessSettingsValues = {
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  country?: string;
  currencyCode?: string;
  timezone?: string;
  status?: string;
  settings?: BusinessPayload["settings"];
};

export default function BusinessSettingsPage() {
  const [form] = Form.useForm<BusinessSettingsValues>();
  const swal = useSwal();
  const queryClient = useQueryClient();
  const businessId = useActiveBusinessId();
  const { data: business, isLoading } = useBusiness(businessId ?? undefined);
  const { updateBusiness, removeBusiness } = useBusinessMutations();
  const setSelectedBusiness = useAuthStore((state) => state.setSelectedBusiness);
  const businesses = useAuthStore((state) => state.businesses);
  const setBusinesses = useAuthStore((state) => state.setBusinesses);
  const selectBusiness = useAuthStore((state) => state.selectBusiness);
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  useEffect(() => {
    if (!business) return;

    form.setFieldsValue({
      name: business.name,
      slug: business.slug,
      email: business.email ?? undefined,
      phone: business.phone ?? undefined,
      country: business.country ?? undefined,
      currencyCode: business.currencyCode ?? "BDT",
      timezone: business.timezone ?? "Asia/Dhaka",
      status: business.status ?? "TRIAL",
      settings: {
        orderPrefix: business.settings?.orderPrefix ?? "ORD",
        invoicePrefix: business.settings?.invoicePrefix ?? "INV",
        defaultLanguage: business.settings?.defaultLanguage ?? "en",
        defaultCurrency:
          business.settings?.defaultCurrency ?? business.currencyCode ?? "BDT",
        timezone: business.settings?.timezone ?? business.timezone ?? "Asia/Dhaka",
        lowStockThreshold: business.settings?.lowStockThreshold ?? 5,
        allowBackorder: business.settings?.allowBackorder ?? false,
        autoConfirmOrder: business.settings?.autoConfirmOrder ?? false,
        codEnabled: business.settings?.codEnabled ?? true,
        onlinePaymentEnabled: business.settings?.onlinePaymentEnabled ?? false,
      },
    });
  }, [business, form]);

  const onFinish = async (values: BusinessSettingsValues) => {
    if (!businessId) return;

    try {
      const updated = await updateBusiness.mutateAsync({
        businessId,
        payload: {
          name: values.name,
          slug: values.slug,
          email: values.email,
          phone: values.phone,
          country: values.country,
          currencyCode: values.currencyCode,
          timezone: values.timezone,
          status: values.status,
          settings: values.settings,
        },
      });

      setSelectedBusiness({
        id: updated.id,
        name: updated.name,
        ownerUserId: updated.ownerUserId ?? 0,
      });
      setBusinesses(
        businesses.map((item) =>
          item.id === updated.id ? { ...item, name: updated.name } : item,
        ),
      );
      swal.success("Business settings saved.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleDeleteBusiness = async () => {
    if (!businessId || !business) return;

    const { isConfirmed } = await swal.confirm({
      title: "Delete business?",
      text: `This will delete ${business.name}. This action cannot be undone.`,
      confirmButtonText: "Delete business",
    });

    if (!isConfirmed) return;

    try {
      await removeBusiness.mutateAsync(businessId);

      const remainingBusinesses = businesses.filter(
        (item) => item.id !== businessId,
      );
      setBusinesses(remainingBusinesses);

      const nextBusiness = remainingBusinesses[0];
      if (nextBusiness) {
        await selectBusiness(nextBusiness.id);
      } else {
        setSelectedBusiness(null);
        await refreshAuth(null);
      }

      await queryClient.invalidateQueries();
      swal.success("Business deleted.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (isLoading) return <Skeleton active paragraph={{ rows: 10 }} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Settings"
        subtitle="These settings are scoped to the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Business Identity">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Business name"
                    rules={[{ required: true, min: 2 }]}
                  >
                    <Input placeholder="Business name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="slug" label="Slug">
                    <Input placeholder="business-slug" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                    <Input placeholder="business@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="Phone">
                    <Input placeholder="+8801712345678" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="country" label="Country">
                    <Input placeholder="Bangladesh" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="status" label="Status">
                    <Select
                      options={[
                        { label: "Trial", value: "TRIAL" },
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                        { label: "Suspended", value: "SUSPENDED" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Regional Defaults">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="currencyCode" label="Business currency">
                    <Select
                      options={[
                        { label: "BDT", value: "BDT" },
                        { label: "USD", value: "USD" },
                        { label: "EUR", value: "EUR" },
                        { label: "GBP", value: "GBP" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="timezone" label="Business timezone">
                    <Select
                      showSearch
                      options={[
                        { label: "Asia/Dhaka", value: "Asia/Dhaka" },
                        { label: "UTC", value: "UTC" },
                        { label: "Asia/Kolkata", value: "Asia/Kolkata" },
                        { label: "Europe/London", value: "Europe/London" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={["settings", "defaultCurrency"]}
                    label="Default order currency"
                  >
                    <Input placeholder="BDT" maxLength={10} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name={["settings", "timezone"]} label="Default timezone">
                    <Input placeholder="Asia/Dhaka" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={["settings", "defaultLanguage"]}
                    label="Default language"
                  >
                    <Select
                      options={[
                        { label: "English", value: "en" },
                        { label: "Bangla", value: "bn" },
                        { label: "Hindi", value: "hi" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={["settings", "lowStockThreshold"]}
                    label="Low stock threshold"
                  >
                    <InputNumber min={0} max={999999} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24}>
            <Card title="Operational Defaults">
              <Row gutter={12}>
                <Col xs={24} md={8}>
                  <Form.Item name={["settings", "orderPrefix"]} label="Order prefix">
                    <Input placeholder="ORD" maxLength={20} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name={["settings", "invoicePrefix"]}
                    label="Invoice prefix"
                  >
                    <Input placeholder="INV" maxLength={20} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name={["settings", "allowBackorder"]}
                    label="Allow backorder"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name={["settings", "autoConfirmOrder"]}
                    label="Auto confirm orders"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name={["settings", "codEnabled"]}
                    label="Cash on delivery"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name={["settings", "onlinePaymentEnabled"]}
                    label="Online payments"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div className="mt-4 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateBusiness.isPending}
          >
            Save settings
          </Button>
        </div>
      </Form>

      <Card title="Danger Zone">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Alert
            showIcon
            type="warning"
            message="Delete this business"
            description="Deleting the active business removes it from your accessible business list. Make sure your team has moved anything important first."
            className="flex-1"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={removeBusiness.isPending}
            onClick={handleDeleteBusiness}
          >
            Delete current business
          </Button>
        </div>
      </Card>
    </div>
  );
}
