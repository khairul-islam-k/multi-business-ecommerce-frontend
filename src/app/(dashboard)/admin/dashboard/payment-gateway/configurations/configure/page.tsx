"use client";

import React, { useMemo } from "react";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";

import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useFinanceAccountQuery, usePaymentGatewayConfigMutations } from "@/lib/api";
import { GatewayMode, PaymentGatewayPayload } from "@/types/payment-gateway";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";

const { Title, Text } = Typography;

type GatewayKey = "sslcommerz" | "aamarpay" | "surjopay";

type GatewayFormValues = {
  sslcommerz: {
    enabled: boolean;
    mode: GatewayMode;
    financeAccountId?: string;
    storeId?: string;
    storePassword?: string;
  };
  aamarpay: {
    enabled: boolean;
    mode: GatewayMode;
    financeAccountId?: string;
    storeId?: string;
    signatureKey?: string;
  };
  surjopay: {
    enabled: boolean;
    mode: GatewayMode;
    financeAccountId?: string;
    endpoint?: string;
    username?: string;
    password?: string;
    prefix?: string;
  };
};

const gatewayConfigs = [
  {
    key: "sslcommerz",
    provider: "SSLCOMMERZ",
    title: "SSLCOMMERZ",
    description: "Configure SSLCOMMERZ payment gateway.",
    fields: [
      {
        name: "storeId",
        label: "Store ID",
        placeholder: "Enter store ID",
        type: "text",
      },
      {
        name: "storePassword",
        label: "Store Password",
        placeholder: "Enter store password",
        type: "password",
      },
    ],
  },
  {
    key: "aamarpay",
    provider: "AAMARPAY",
    title: "AAMARPAY",
    description: "Configure AAMARPAY payment gateway.",
    fields: [
      {
        name: "storeId",
        label: "Store ID",
        placeholder: "Enter store ID",
        type: "text",
      },
      {
        name: "signatureKey",
        label: "Signature Key",
        placeholder: "Enter signature key",
        type: "password",
      },
    ],
  },
  {
    key: "surjopay",
    provider: "SURJOPAY",
    title: "SURJOPAY",
    description: "Configure SURJOPAY payment gateway.",
    fields: [
      {
        name: "endpoint",
        label: "Endpoint",
        placeholder: "Enter endpoint URL",
        type: "text",
      },
      {
        name: "username",
        label: "Username",
        placeholder: "Enter username",
        type: "text",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Enter password",
        type: "password",
      },
      {
        name: "prefix",
        label: "Prefix",
        placeholder: "Enter prefix",
        type: "text",
      },
    ],
  },
] as const;

const PaymentGateway = () => {
  const [form] = Form.useForm<GatewayFormValues>();
  const swal = useSwal();

  const businessId = useActiveBusinessId();

  const { data: financeAccounts, isLoading: financeAccountsLoading } =
    useFinanceAccountQuery(businessId ?? "", {
      page: 1,
      limit: 100,
      status: "ACTIVE",
    });

  const { createAllConfig } = usePaymentGatewayConfigMutations(businessId ?? "");

  const financeAccountOptions = useMemo(() => {
    return (
      financeAccounts?.items?.map((account) => ({
        label: account.name,
        value: account.id,
      })) ?? []
    );
  }, [financeAccounts?.items]);

  const requiredWhenEnabled = (gatewayKey: GatewayKey, label: string) => ({
    validator(_: unknown, value: string | undefined) {
      const enabled = form.getFieldValue([gatewayKey, "enabled"]);

      if (!enabled) {
        return Promise.resolve();
      }

      if (!value || !String(value).trim()) {
        return Promise.reject(new Error(`${label} is required`));
      }

      return Promise.resolve();
    },
  });

  const onSubmit = async (values: GatewayFormValues) => {
    const payload: PaymentGatewayPayload = {
      configs: gatewayConfigs
        .filter((gateway) => {
          const gatewayKey = gateway.key as GatewayKey;
          return values[gatewayKey]?.enabled === true;
        })
        .map((gateway) => {
          const gatewayKey = gateway.key as GatewayKey;
          const gatewayValues = values[gatewayKey] as Record<string, unknown>;

          const configData = gateway.fields.reduce<Record<string, string>>(
            (acc, field) => {
              const value = gatewayValues[field.name];

              if (value !== undefined && value !== null && value !== "") {
                acc[field.name] = String(value);
              }

              return acc;
            },
            {},
          );

          return {
            provider: gateway.provider,
            financeAccountId: gatewayValues.financeAccountId as string,
            mode: gatewayValues.mode as GatewayMode,
            status: "ACTIVE",
            configData,
          };
        }),
    };

    console.log("body", payload);

    try {
      const res = await createAllConfig.mutateAsync(payload);

      console.log("Payment gateway response:", res);

      swal.success("Payment gateway configuration saved successfully.");

      form.resetFields();
    } catch (error: unknown) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          Payment Gateways
        </Title>

        <Text type="secondary">
          Manage your payment gateway configuration for this business.
        </Text>
      </div>

      <Form<GatewayFormValues>
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          sslcommerz: {
            enabled: false,
            mode: "SANDBOX",
          },
          aamarpay: {
            enabled: false,
            mode: "SANDBOX",
          },
          surjopay: {
            enabled: false,
            mode: "SANDBOX",
          },
        }}
      >
        <Collapse
          accordion={false}
          defaultActiveKey={["sslcommerz"]}
          className="rounded-2xl bg-white"
          items={gatewayConfigs.map((gateway) => {
            const gatewayKey = gateway.key as GatewayKey;

            return {
              key: gateway.key,
              label: (
                <div>
                  <h3 className="mb-0 font-semibold text-gray-900">
                    {gateway.title}
                  </h3>

                  <p className="mb-0 text-sm font-normal text-gray-500">
                    {gateway.description}
                  </p>
                </div>
              ),
              extra: (
                <Form.Item
                  name={[gatewayKey, "enabled"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    onClick={(_, event) => {
                      event.stopPropagation();
                    }}
                  />
                </Form.Item>
              ),
              children: (
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, next) =>
                    prev?.[gatewayKey]?.enabled !==
                    next?.[gatewayKey]?.enabled
                  }
                >
                  {({ getFieldValue }) => {
                    const enabled = getFieldValue([gatewayKey, "enabled"]);

                    return (
                      <Card className="rounded-xl border border-gray-200 shadow-sm">
                        <div className={!enabled ? "opacity-70" : ""}>
                          <Form.Item
                            label="Mode"
                            name={[gatewayKey, "mode"]}
                          >
                            <Radio.Group
                              disabled={!enabled}
                              optionType="button"
                              buttonStyle="solid"
                            >
                              <Radio.Button value="SANDBOX">
                                Sandbox
                              </Radio.Button>

                              <Radio.Button value="LIVE">Live</Radio.Button>
                            </Radio.Group>
                          </Form.Item>

                          <Form.Item
                            label="Finance Account"
                            name={[gatewayKey, "financeAccountId"]}
                            dependencies={[[gatewayKey, "enabled"]]}
                            rules={[
                              requiredWhenEnabled(
                                gatewayKey,
                                "Finance account",
                              ),
                            ]}
                          >
                            <Select
                              showSearch
                              allowClear
                              disabled={!enabled}
                              loading={financeAccountsLoading}
                              placeholder="Select finance account"
                              options={financeAccountOptions}
                              optionFilterProp="label"
                            />
                          </Form.Item>

                          {gateway.fields.map((field) => (
                            <Form.Item
                              key={field.name}
                              label={field.label}
                              name={[gatewayKey, field.name]}
                              dependencies={[[gatewayKey, "enabled"]]}
                              rules={[
                                requiredWhenEnabled(gatewayKey, field.label),
                              ]}
                            >
                              {field.type === "password" ? (
                                <Input.Password
                                  disabled={!enabled}
                                  placeholder={field.placeholder}
                                />
                              ) : (
                                <Input
                                  disabled={!enabled}
                                  placeholder={field.placeholder}
                                />
                              )}
                            </Form.Item>
                          ))}
                        </div>
                      </Card>
                    );
                  }}
                </Form.Item>
              ),
            };
          })}
        />

        <div className="mt-6 flex justify-end">
          <Space>
            <Button onClick={() => form.resetFields()}>Reset</Button>

            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Configuration
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default PaymentGateway;