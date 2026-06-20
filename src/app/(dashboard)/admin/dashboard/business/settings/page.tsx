"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useBusiness, useBusinessMutations } from "@/lib/api";
import type { AuthBusiness, BusinessPayload } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import {
  countryOptions,
  currencyOptions,
  timezoneOptions,
} from "@/lib/business/options";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { PERMISSIONS } from "@/lib/auth/permissions";
import Loader from "@/components/shared/loader";

const { Text } = Typography;

const prefixFields: Array<{
  name: keyof NonNullable<BusinessPayload["settings"]>;
  label: string;
  placeholder: string;
}> = [
  { name: "orderPrefix", label: "Order prefix", placeholder: "ORD" },
  { name: "invoicePrefix", label: "Invoice prefix", placeholder: "INV" },
  { name: "paymentPrefix", label: "Payment prefix", placeholder: "PAY" },
  { name: "shipmentPrefix", label: "Shipment prefix", placeholder: "SHP" },
  { name: "purchaseOrderPrefix", label: "Purchase order prefix", placeholder: "PO" },
  { name: "purchaseReturnPrefix", label: "Purchase return prefix", placeholder: "RET" },
  { name: "stockAdjustmentPrefix", label: "Stock adjustment prefix", placeholder: "ADJ" },
  { name: "stockTransferPrefix", label: "Stock transfer prefix", placeholder: "TRF" },
  { name: "expensePrefix", label: "Expense prefix", placeholder: "EXP" },
  { name: "supplierInvoicePrefix", label: "Supplier invoice prefix", placeholder: "SIN" },
  { name: "supplierPaymentPrefix", label: "Supplier payment prefix", placeholder: "SPAY" },
  { name: "receivablePrefix", label: "Receivable prefix", placeholder: "REC" },
  { name: "payablePrefix", label: "Payable prefix", placeholder: "PAYB" },
  { name: "transactionPrefix", label: "Transaction prefix", placeholder: "TXN" },
  { name: "productSkuPrefix", label: "Product SKU prefix", placeholder: "SKU" },
  { name: "productBarcodePrefix", label: "Product barcode prefix", placeholder: "BAR" },
  { name: "variantSkuPrefix", label: "Variant SKU prefix", placeholder: "SKU" },
  { name: "variantBarcodePrefix", label: "Variant barcode prefix", placeholder: "BAR" },
];

type BusinessSettingsValues = {
  name: string;
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
  const setSelectedBusiness = useAuthStore(
    (state) => state.setSelectedBusiness,
  );
  const businesses = useAuthStore((state) => state.businesses);
  const setBusinesses = useAuthStore((state) => state.setBusinesses);
  const deletableBusinesses = businesses.filter(
    (item) => item.id !== businessId,
  );
  const updatePermission = usePermissionAccess(PERMISSIONS.businessUpdate);
  const deletePermission = usePermissionAccess(PERMISSIONS.businessDelete);

  useEffect(() => {
    if (!business) return;

    form.setFieldsValue({
      name: business.name,
      email: business.email ?? undefined,
      phone: business.phone ?? undefined,
      country: business.country ?? undefined,
      currencyCode: business.currencyCode ?? "BDT",
      timezone: business.timezone ?? "Asia/Dhaka",
      status: business.status ?? "ACTIVE",
      settings: {
        orderPrefix: business.settings?.orderPrefix ?? "ORD",
        invoicePrefix: business.settings?.invoicePrefix ?? "INV",
        paymentPrefix: business.settings?.paymentPrefix ?? "PAY",
        shipmentPrefix: business.settings?.shipmentPrefix ?? "SHP",
        purchaseOrderPrefix: business.settings?.purchaseOrderPrefix ?? "PO",
        purchaseReturnPrefix: business.settings?.purchaseReturnPrefix ?? "RET",
        stockAdjustmentPrefix:
          business.settings?.stockAdjustmentPrefix ?? "ADJ",
        stockTransferPrefix: business.settings?.stockTransferPrefix ?? "TRF",
        expensePrefix: business.settings?.expensePrefix ?? "EXP",
        supplierInvoicePrefix:
          business.settings?.supplierInvoicePrefix ?? "SIN",
        supplierPaymentPrefix:
          business.settings?.supplierPaymentPrefix ?? "SPAY",
        receivablePrefix: business.settings?.receivablePrefix ?? "REC",
        payablePrefix: business.settings?.payablePrefix ?? "PAYB",
        transactionPrefix: business.settings?.transactionPrefix ?? "TXN",
        productSkuPrefix: business.settings?.productSkuPrefix ?? "SKU",
        productBarcodePrefix:
          business.settings?.productBarcodePrefix ?? "BAR",
        variantSkuPrefix: business.settings?.variantSkuPrefix ?? "SKU",
        variantBarcodePrefix:
          business.settings?.variantBarcodePrefix ?? "BAR",
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
          email: values.email?.trim() || undefined,
          phone: values.phone?.trim() || undefined,
          country: values.country?.trim() || undefined,
          currencyCode: values.currencyCode || undefined,
          timezone: values.timezone || undefined,
          status: values.status,
          settings: values.settings,
        },
      });

      setSelectedBusiness({
        id: updated.id,
        name: updated.name,
        ownerUserId: updated.ownerUserId ?? "",
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


  const handleDeleteBusiness = (targetBusiness: AuthBusiness) => {
    if (targetBusiness.id === businessId) return;

    swal.modal.confirm({
      title: "Delete business?",
      content: `This will delete ${targetBusiness.name}. This action cannot be undone.`,
      okText: "Delete business",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeBusiness.mutateAsync(targetBusiness.id);

          const remainingBusinesses = businesses.filter(
            (item) => item.id !== targetBusiness.id,
          );

          setBusinesses(remainingBusinesses);

          await queryClient.invalidateQueries();

          swal.success("Business deleted.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (isLoading) {
    return (
      <Loader
        label="Loading business settings"
        description="Fetching the active business configuration."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Settings"
        subtitle="Update identity, regional defaults, and operational settings for the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={!updatePermission.allowed}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Business Identity">
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="Business name"
                    rules={[{ required: true, min: 2 }]}
                  >
                    <Input placeholder="Business name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: "email" }]}
                  >
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
                    <Select
                      showSearch
                      allowClear
                      placeholder="Select country"
                      optionFilterProp="label"
                      options={countryOptions}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="status" label="Status">
                    <Select
                      options={[
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
                      showSearch
                      allowClear
                      placeholder="Select currency"
                      optionFilterProp="label"
                      options={currencyOptions}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="timezone" label="Business timezone">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Select timezone"
                      optionFilterProp="label"
                      options={timezoneOptions}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={["settings", "lowStockThreshold"]}
                    label="Low stock threshold"
                  >
                    <InputNumber
                      min={0}
                      max={999999}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24}>
            <Card title="Operational Defaults">
              <Row gutter={12}>
                {prefixFields.map((field) => (
                  <Col xs={24} md={8} key={field.name}>
                    <Form.Item
                      name={["settings", field.name]}
                      label={field.label}
                    >
                      <Input placeholder={field.placeholder} maxLength={20} />
                    </Form.Item>
                  </Col>
                ))}
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

        {updatePermission.allowed && (
          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={updateBusiness.isPending}
            >
              Save settings
            </Button>
          </div>
        )}
      </Form>

      <Card title="Other Businesses">
        <div className="space-y-4">
          <Alert
            showIcon
            type="warning"
            title="Active business is protected"
            description="The currently selected business cannot be deleted from this screen. Switch to another business first, then delete it from this list."
          />

          {deletableBusinesses.length ? (
            <Space orientation="vertical" className="w-full" size={10}>
              {deletableBusinesses.map((item) => (
                <Flex
                  key={item.id}
                  align="center"
                  justify="space-between"
                  gap={16}
                  className="rounded-lg border border-solid border-black/10 p-3"
                >
                  <div className="min-w-0">
                    <Text strong ellipsis style={{ display: "block" }}>
                      {item.name}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      Business ID {item.id}
                    </Text>
                  </div>
                  {deletePermission.allowed && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={removeBusiness.isPending}
                      onClick={() => handleDeleteBusiness(item)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>
              ))}
            </Space>
          ) : (
            <Empty description="No other businesses available to delete" />
          )}

          {business && <Tag color="green">Current: {business.name}</Tag>}
        </div>
      </Card>
    </div>
  );
}
