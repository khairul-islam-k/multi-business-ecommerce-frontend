"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BankOutlined,
  CheckOutlined,
  DownOutlined,
  PlusOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";

import { useSwal } from "@/hooks/use-swal";
import { useBusinessMutations } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";
import type { AuthBusiness, BusinessPayload } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import {
  countryOptions,
  currencyOptions,
  timezoneOptions,
} from "@/lib/business/options";

const { Text } = Typography;

type BusinessFormValues = Pick<
  BusinessPayload,
  "name" | "slug" | "email" | "phone" | "country" | "currencyCode" | "timezone"
>;

const defaultValues: Partial<BusinessFormValues> = {
  currencyCode: "BDT",
  timezone: "Asia/Dhaka",
};

const businessInitial = (business?: AuthBusiness | null) =>
  business?.name?.trim()?.charAt(0).toUpperCase() || "B";

export default function BusinessDropdown() {
  const [form] = Form.useForm<BusinessFormValues>();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const swal = useSwal();
  const { token } = theme.useToken();

  const userType = useAuthStore((state) => state.user?.type);
  const businesses = useAuthStore((state) => state.businesses);
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const setBusinesses = useAuthStore((state) => state.setBusinesses);
  const selectBusiness = useAuthStore((state) => state.selectBusiness);
  const { createBusiness } = useBusinessMutations();

  const canCreateBusiness = userType === "TENANT" || userType === "ADMIN";

  const sortedBusinesses = useMemo(
    () =>
      [...businesses].sort((a, b) => {
        if (a.id === selectedBusiness?.id) return -1;
        if (b.id === selectedBusiness?.id) return 1;
        return a.name.localeCompare(b.name);
      }),
    [businesses, selectedBusiness?.id],
  );

  const handleSelect = async (businessId: number) => {
    if (businessId === selectedBusiness?.id) return;

    try {
      await selectBusiness(businessId);
      await queryClient.invalidateQueries();
      swal.success("Business switched.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleCreate = async (values: BusinessFormValues) => {
    try {
      const payload = {
        ...values,
        slug: values.slug?.trim() || undefined,
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        country: values.country?.trim() || undefined,
        currencyCode: values.currencyCode || undefined,
        timezone: values.timezone || undefined,
      } satisfies BusinessFormValues;

      const business = await createBusiness.mutateAsync({
        ...payload,
        status: "TRIAL",
        settings: {
          defaultCurrency: payload.currencyCode,
          timezone: payload.timezone,
          defaultLanguage: "en",
          orderPrefix: "ORD",
          invoicePrefix: "INV",
          lowStockThreshold: 5,
          allowBackorder: false,
          autoConfirmOrder: false,
          codEnabled: true,
          onlinePaymentEnabled: false,
        },
        branding: {
          primaryColor: "#0f766e",
          secondaryColor: "#f8fafc",
          accentColor: "#f59e0b",
          fontFamily: "Inter",
          seoTitle: payload.name,
        },
      });

      const nextBusiness: AuthBusiness = {
        id: business.id,
        name: business.name,
        ownerUserId: business.ownerUserId ?? 0,
      };

      setBusinesses([
        ...businesses.filter((item) => item.id !== business.id),
        nextBusiness,
      ]);
      await selectBusiness(business.id);
      await queryClient.invalidateQueries();
      form.resetFields();
      setOpen(false);
      swal.success("Business created and selected.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const menuItems = [
    ...sortedBusinesses.map((business) => ({
      key: String(business.id),
      label: (
        <Flex align="center" justify="space-between" gap={16}>
          <Space size={10}>
            <Avatar size="small" style={{ background: token.colorPrimary }}>
              {businessInitial(business)}
            </Avatar>
            <div className="min-w-0">
              <Text strong ellipsis style={{ maxWidth: 180 }}>
                {business.name}
              </Text>
              {business.id === selectedBusiness?.id && (
                <div>
                  <Tag color="green" bordered={false}>
                    Active
                  </Tag>
                </div>
              )}
            </div>
          </Space>
          {business.id === selectedBusiness?.id && <CheckOutlined />}
        </Flex>
      ),
      onClick: () => handleSelect(business.id),
    })),
    {
      type: "divider" as const,
    },
    {
      key: "create",
      disabled: !canCreateBusiness,
      label: (
        <Button
          block
          type="text"
          icon={<PlusOutlined />}
          disabled={!canCreateBusiness}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(true);
          }}
          style={{ textAlign: "left" }}
        >
          Create business
        </Button>
      ),
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          size="large"
          style={{
            height: 42,
            paddingInline: 12,
            borderColor: token.colorBorderSecondary,
          }}
        >
          <Space size={10}>
            <Avatar size="small" icon={<ShopOutlined />}>
              {businessInitial(selectedBusiness)}
            </Avatar>
            <span className="hidden max-w-40 truncate text-left font-medium sm:inline-block">
              {selectedBusiness?.name ?? "Select business"}
            </span>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      <Modal
        title="Create business"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Create and switch"
        confirmLoading={createBusiness.isPending}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues}
          onFinish={handleCreate}
        >
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Business name"
                rules={[{ required: true, min: 2 }]}
              >
                <Input prefix={<BankOutlined />} placeholder="Acme Store" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="slug" label="Slug">
                <Input placeholder="acme-store" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                <Input placeholder="store@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+8801712345678" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item name="currencyCode" label="Currency">
                <Select
                  showSearch
                  allowClear
                  placeholder="Select currency"
                  optionFilterProp="label"
                  options={currencyOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="timezone" label="Timezone">
                <Select
                  showSearch
                  allowClear
                  placeholder="Select timezone"
                  optionFilterProp="label"
                  options={timezoneOptions}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
