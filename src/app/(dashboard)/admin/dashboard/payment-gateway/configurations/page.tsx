"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useSwal } from "@/hooks/use-swal";
import {
  useFinanceAccountQuery,
  usePaymentGatewayConfigMutations,
  usePaymentGatewayConfigsQuery,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";
import { UpdatePaymentGatewayConfigPayload } from "@/types/payment-gateway";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Empty,
  Form,
  Input,
  Radio,
  Select,
  Skeleton,
  Switch,
  Typography,
  type CollapseProps,
  type FormInstance,
} from "antd";
import { CreditCard, Save, ShieldCheck } from "lucide-react";
import { useEffect, useMemo } from "react";

const { Text } = Typography;

type GatewayCode = "SSLCOMMERZ" | "AAMARPAY" | "SHURJOPAY";
type GatewayMode = "SANDBOX" | "LIVE";
type GatewayStatus = "ACTIVE" | "INACTIVE";

type PaymentGatewayConfigItem = {
  id: string;
  businessId: string;
  gatewayId: string;
  financeAccountId: string;
  configData: Record<string, string>;
  mode: GatewayMode;
  status: GatewayStatus;
  gateway: {
    id: string;
    name: string;
    code: GatewayCode | string;
    description?: string;
    status: GatewayStatus | string;
  };
  account?: {
    id: string;
    name: string;
    accountType?: string;
    currencyCode?: string;
  };
};

type PaymentGatewayFormItem = {
  id: string;
  gatewayId: string;
  provider: GatewayCode | string;
  financeAccountId: string;
  mode: GatewayMode;
  status: GatewayStatus;
  configData: Record<string, string>;
};

type PaymentGatewayFormValues = {
  gateways: PaymentGatewayFormItem[];
};

type ConfigField = {
  name: string;
  label: string;
  placeholder: string;
  secret?: boolean;
};

const GATEWAY_CONFIG_FIELDS: Record<GatewayCode, ConfigField[]> = {
  SSLCOMMERZ: [
    {
      name: "storeId",
      label: "Store ID",
      placeholder: "Enter SSLCOMMERZ store ID",
    },
    {
      name: "storePassword",
      label: "Store Password",
      placeholder: "Enter SSLCOMMERZ store password",
      secret: true,
    },
  ],

  AAMARPAY: [
    {
      name: "storeId",
      label: "Store ID",
      placeholder: "Enter aamarPay store ID",
    },
    {
      name: "signatureKey",
      label: "Signature Key",
      placeholder: "Enter aamarPay signature key",
      secret: true,
    },
  ],

  SHURJOPAY: [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter shurjoPay username",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter shurjoPay password",
      secret: true,
    },
    {
      name: "prefix",
      label: "Prefix",
      placeholder: "Enter shurjoPay prefix",
    },
  ],
};

function normalizeGatewayCode(code?: string): GatewayCode | string {
  return String(code ?? "").toUpperCase();
}

function getGatewayConfigFields(code?: string): ConfigField[] {
  const gatewayCode = normalizeGatewayCode(code);

  if (gatewayCode in GATEWAY_CONFIG_FIELDS) {
    return GATEWAY_CONFIG_FIELDS[gatewayCode as GatewayCode];
  }

  return [];
}

function buildInitialValues(
  configs: PaymentGatewayConfigItem[],
): PaymentGatewayFormValues {
  return {
    gateways: configs.map((item) => {
      const provider = normalizeGatewayCode(item.gateway?.code);
      const fields = getGatewayConfigFields(provider);

      const configData = fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = item.configData?.[field.name] ?? "";
        return acc;
      }, {});

      return {
        id: item.id,
        gatewayId: item.gatewayId,
        provider,
        financeAccountId: item.financeAccountId,
        mode: item.mode ?? "SANDBOX",
        status: item.status ?? "INACTIVE",
        configData,
      };
    }),
  };
}

function cleanConfigData(
  provider: string,
  configData: Record<string, string>,
): Record<string, string> {
  const fields = getGatewayConfigFields(provider);

  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = configData?.[field.name]?.trim?.() ?? "";
    return acc;
  }, {});
}

function GatewayStatusSwitch({
  form,
  index,
}: {
  form: FormInstance<PaymentGatewayFormValues>;
  index: number;
}) {
  const status = Form.useWatch(["gateways", index, "status"], form);
  const isActive = status === "ACTIVE";

  return (
    <div
      className="flex shrink-0 items-center gap-2"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span
        className={
          isActive
            ? "hidden text-[11px] font-semibold text-emerald-600 xs:inline sm:inline"
            : "hidden text-[11px] font-semibold text-gray-500 xs:inline sm:inline"
        }
      >
        {isActive ? "ACTIVE" : "INACTIVE"}
      </span>

      <Form.Item
        noStyle
        name={["gateways", index, "status"]}
        getValueProps={(value: GatewayStatus) => ({
          checked: value === "ACTIVE",
        })}
        getValueFromEvent={(checked: boolean) =>
          checked ? "ACTIVE" : "INACTIVE"
        }
      >
        <Switch
          size="small"
          checkedChildren="ON"
          unCheckedChildren="OFF"
          className="shrink-0"
        />
      </Form.Item>
    </div>
  );
}

export default function PaymentGatewayConfigurations() {
  const [form] = Form.useForm<PaymentGatewayFormValues>();
  const businessId = useActiveBusinessId();
  const swal = useSwal();

  const { data: financeAccounts, isLoading: financeAccountsLoading } =
    useFinanceAccountQuery(businessId ?? "", {
      page: 1,
      limit: 100,
      status: "ACTIVE",
    });

  const {
    data: paymentGateway,
    isLoading: paymentGatewayLoading,
    isFetching: paymentGatewayFetching,
  } = usePaymentGatewayConfigsQuery(businessId ?? "");

  const { updateConfigs } = usePaymentGatewayConfigMutations(
    businessId ?? "",
  );

  const financeAccountOptions = useMemo(() => {
    return (
      financeAccounts?.items?.map((account) => ({
        label: `${account.name}${account.accountType ? ` (${account.accountType})` : ""
          }`,
        value: account.id,
      })) ?? []
    );
  }, [financeAccounts?.items]);

  const gatewayConfigs = useMemo(() => {
    const response = paymentGateway as any;

    if (Array.isArray(response)) {
      return response as PaymentGatewayConfigItem[];
    }

    if (Array.isArray(response?.items)) {
      return response.items as PaymentGatewayConfigItem[];
    }

    if (Array.isArray(response?.data)) {
      return response.data as PaymentGatewayConfigItem[];
    }

    return [];
  }, [paymentGateway]);

  useEffect(() => {
    if (!gatewayConfigs.length) return;

    form.setFieldsValue(buildInitialValues(gatewayConfigs));
  }, [form, gatewayConfigs]);

  const isLoading =
    paymentGatewayLoading || paymentGatewayFetching || financeAccountsLoading;

  const isSaving = updateConfigs?.isPending;

  const handleSubmit = async () => {
  const values = form.getFieldsValue(true) as PaymentGatewayFormValues;

  const payload: UpdatePaymentGatewayConfigPayload = {
    configs: values.gateways.map((item: PaymentGatewayFormItem) => ({
      id: item.id,
      provider: item.provider,
      financeAccountId: item.financeAccountId,
      mode: item.mode,
      status: item.status,
      configData: cleanConfigData(item.provider, item.configData),
    })),
  };

  try {
    console.log("payload", payload);

    const res = await updateConfigs.mutateAsync({
      payload,
    });

    swal.success("Payment gateway configurations updated successfully.");
  } catch (error) {
    swal.error(getApiErrorMessage(error));
  }
};

  const collapseItems: CollapseProps["items"] = gatewayConfigs.map(
    (gatewayItem, index) => {
      const provider = normalizeGatewayCode(gatewayItem.gateway?.code);
      const configFields = getGatewayConfigFields(provider);

      return {
        key: gatewayItem.id,
        forceRender: true,

        label: (
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:size-10">
              <CreditCard size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                {gatewayItem.gateway?.name}
              </div>

              <div className="mt-0.5 hidden truncate text-[11px] text-gray-500 sm:block">
                {gatewayItem.gateway?.description}
              </div>

              <div className="mt-1 inline-flex max-w-full rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                <span className="truncate">{provider}</span>
              </div>
            </div>
          </div>
        ),

        extra: <GatewayStatusSwitch form={form} index={index} />,

        children: (
          <div className="space-y-4 sm:space-y-5">
            <Form.Item name={["gateways", index, "id"]} hidden>
              <Input />
            </Form.Item>

            <Form.Item name={["gateways", index, "gatewayId"]} hidden>
              <Input />
            </Form.Item>

            <Form.Item name={["gateways", index, "provider"]} hidden>
              <Input />
            </Form.Item>

            <Card
              size="small"
              className="rounded-2xl border border-gray-100 shadow-sm"
              title={
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold sm:text-sm">
                    Gateway Setup
                  </span>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Form.Item
                  label="Finance Account"
                  name={["gateways", index, "financeAccountId"]}
                  rules={[
                    {
                      required: true,
                      message: "Finance account is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select finance account"
                    options={financeAccountOptions}
                    loading={financeAccountsLoading}
                    optionFilterProp="label"
                  />
                </Form.Item>

                <Form.Item
                  label="Gateway Mode"
                  name={["gateways", index, "mode"]}
                  rules={[
                    {
                      required: true,
                      message: "Gateway mode is required",
                    },
                  ]}
                >
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    className="grid w-full grid-cols-2 gap-2"
                  >
                    <Radio.Button
                      value="SANDBOX"
                      className="h-9 rounded-lg! text-center text-xs leading-9! sm:h-10 sm:text-sm sm:leading-10!"
                    >
                      SANDBOX
                    </Radio.Button>

                    <Radio.Button
                      value="LIVE"
                      className="h-9 rounded-lg! text-center text-xs leading-9! sm:h-10 sm:text-sm sm:leading-10!"
                    >
                      LIVE
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Card>

            <Card
              size="small"
              className="rounded-2xl border border-gray-100 shadow-sm"
              title={
                <div>
                  <Text strong className="text-xs sm:text-sm">
                    Credential Information
                  </Text>

                  <div className="mt-0.5 text-[11px] font-normal text-gray-500 sm:text-xs">
                    Add merchant credential values for{" "}
                    {gatewayItem.gateway?.name}.
                  </div>
                </div>
              }
            >
              {configFields.length ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {configFields.map((field) => {
                    const InputComponent = field.secret
                      ? Input.Password
                      : Input;

                    return (
                      <Form.Item
                        key={field.name}
                        label={field.label}
                        name={[
                          "gateways",
                          index,
                          "configData",
                          field.name,
                        ]}
                        rules={[
                          {
                            required: true,
                            message: `${field.label} is required`,
                          },
                        ]}
                      >
                        <InputComponent placeholder={field.placeholder} />
                      </Form.Item>
                    );
                  })}
                </div>
              ) : (
                <Alert
                  type="warning"
                  showIcon
                  message="Unsupported gateway"
                  description={`No credential fields are configured for provider code: ${provider}`}
                />
              )}
            </Card>
          </div>
        ),
      };
    },
  );

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Gateway Configurations"
        subtitle="Create and manage provider credentials, mode, status, and settlement account mappings for checkout payments."
        breadcrumb={adminBreadcrumb}
      />

      <Card className="rounded-2xl shadow-sm">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : !gatewayConfigs.length ? (
          <Empty description="No payment gateway configuration found" />
        ) : (
          <Form
            form={form}
            layout="vertical"
            preserve
            onFinish={handleSubmit}
            initialValues={buildInitialValues(gatewayConfigs)}
            className="gateway-config-form"
          >
            <Collapse
              accordion
              bordered={false}
              destroyOnHidden={false}
              items={collapseItems}
              defaultActiveKey={gatewayConfigs[0]?.id}
              className="gateway-config-collapse bg-transparent"
            />

            <div className="mt-5 flex justify-end border-t border-gray-100 pt-5">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSaving}
                icon={<Save size={16} />}
                className="w-full sm:w-auto"
              >
                Save Configurations
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}
