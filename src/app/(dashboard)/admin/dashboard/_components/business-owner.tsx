"use client";

import {
  Check,
  ChevronDown,
  CirclePlus,
  Landmark,
} from "lucide-react";


import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  App,
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

import { useBusinessMutations } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";
import type { AuthBusiness, Business, BusinessPayload } from "@/lib/api";
import { useBusinesses } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import {
  countryOptions,
  currencyOptions,
  timezoneOptions,
} from "@/lib/business/options";

const { Text } = Typography;

type BusinessFormValues = Pick<
  BusinessPayload,
  "name" | "email" | "phone" | "country" | "currencyCode" | "timezone"
>;

const defaultValues: Partial<BusinessFormValues> = {
  country: "Bangladesh",
  currencyCode: "BDT",
  timezone: "Asia/Dhaka",
};

const businessInitial = (business?: AuthBusiness | null) =>
  business?.name?.trim()?.charAt(0).toUpperCase() || "B";

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return baseUrl ? `${baseUrl}${url}` : url;
};

export default function BusinessDropdown() {
  const [form] = Form.useForm<BusinessFormValues>();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const userType = useAuthStore((state) => state.user?.type);
  const businesses = useAuthStore((state) => state.businesses);
  const selectedBusiness = useAuthStore((state) => state.selectedBusiness);
  const setBusinesses = useAuthStore((state) => state.setBusinesses);
  const selectBusiness = useAuthStore((state) => state.selectBusiness);
  const { createBusiness } = useBusinessMutations();
  const richBusinesses = useBusinesses({ page: 1, limit: 100 });

  const canCreateBusiness = userType === "TENANT";

  const sortedBusinesses = useMemo(
    () =>
      [...businesses].sort((a, b) => {
        if (a.id === selectedBusiness?.id) return -1;
        if (b.id === selectedBusiness?.id) return 1;
        return a.name.localeCompare(b.name);
      }),
    [businesses, selectedBusiness?.id],
  );

  const businessDetailsById = useMemo(() => {
    const records = new Map<string, Business>();
    (richBusinesses.data?.items ?? []).forEach((business) => {
      records.set(business.id, business);
    });
    return records;
  }, [richBusinesses.data?.items]);

  const selectedBusinessDetails = selectedBusiness
    ? businessDetailsById.get(selectedBusiness.id)
    : undefined;

  const handleSelect = async (businessId: string) => {
    if (businessId === selectedBusiness?.id) return;

    try {
      await selectBusiness(businessId);
      await queryClient.invalidateQueries();
      message.success("Business switched.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleCreate = async (values: BusinessFormValues) => {
    try {
      const payload = {
        ...values,
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        country: values.country?.trim() || undefined,
        currencyCode: values.currencyCode || undefined,
        timezone: values.timezone || undefined,
      } satisfies BusinessFormValues;

      const business = await createBusiness.mutateAsync({
        ...payload,
        settings: {
  
        },
        branding: {
          seoTitle: payload.name,
        },
      });

      const nextBusiness: AuthBusiness = {
        id: business.id,
        name: business.name,
        ownerUserId: business.ownerUserId ?? "",
      };

      setBusinesses([
        ...businesses.filter((item) => item.id !== business.id),
        nextBusiness,
      ]);
      await selectBusiness(business.id);
      await queryClient.invalidateQueries();
      form.resetFields();
      setOpen(false);
      message.success("Business created and selected.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const menuItems = [
    ...sortedBusinesses.map((business) => ({
      key: business.id,
      label: (
        <Flex align="center" justify="space-between" gap={16}>
          <Space size={10}>
            <Avatar
              size="small"
              src={resolveAssetUrl(
                businessDetailsById.get(business.id)?.branding?.logoUrl,
              )}
              style={{ background: token.colorPrimary }}
            >
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
          {business.id === selectedBusiness?.id && <Check />}
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
          icon={<CirclePlus />}
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
            <Avatar
              size="small"
              src={resolveAssetUrl(selectedBusinessDetails?.branding?.logoUrl)}
              style={{ background: token.colorPrimary }}
            >
              {businessInitial(selectedBusiness)}
            </Avatar>
            <span className="hidden max-w-40 truncate text-left font-medium sm:inline-block">
              {selectedBusiness?.name ?? "Select business"}
            </span>
            <ChevronDown />
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
            <Col span={24}>
              <Form.Item
                name="name"
                label="Business name"
                rules={[{ required: true, min: 2 }]}
              >
                <Input prefix={<Landmark />} placeholder="Acme Store" />
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
