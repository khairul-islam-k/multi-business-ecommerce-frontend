"use client";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useCourierMutation,
  // useCourierConfigMutations,
  useCourierQuery,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { CourierConfigData, UpdateCourierConfigPayload } from "@/types/courier/courier";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Collapse,
  Empty,
  Form,
  Input,
  Radio,
  Switch,
  Typography,
  type CollapseProps,
  type FormInstance,
} from "antd";
import { Save, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo } from "react";

const { Text } = Typography;

export type ApiId = string;

export type CourierProviderCode = "REDX";

export type CourierMode = "LIVE" | "SANDBOX";

export type CourierStatus = "ACTIVE" | "INACTIVE";


export type CourierProvider = {
  id: ApiId;
  name: string;
  code: CourierProviderCode | string;
  description: string;
  status: CourierStatus | string;
  createdAt: string;
  updatedAt: string;
};

export type CourierConfigResponse = {
  id: ApiId;
  businessId: ApiId;
  courierId: ApiId;

  configData: CourierConfigData;

  mode: CourierMode;
  status: CourierStatus;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  courier: CourierProvider;

  webhookConfigured: boolean;
  webhookUrlHint: string;
};

type CourierConfigFormItem = {
  configId: ApiId;
  courierId: ApiId;
  provider: CourierProviderCode | string;

  configData: CourierConfigData;

  mode: CourierMode;
  status: CourierStatus;
  rotateWebhookToken: boolean;
};

type CourierConfigFormValues = {
  configs: CourierConfigFormItem[];
};

type ConfigField = {
  name: string;
  label: string;
  placeholder: string;
  secret?: boolean;
};

const COURIER_CONFIG_FIELDS: Record<CourierProviderCode, ConfigField[]> = {
  REDX: [
    {
      name: "apiAccessToken",
      label: "API Access Token",
      placeholder: "Enter REDX API access token",
      secret: true,
    },
  ],
};

function normalizeCourierCode(code?: string): CourierProviderCode | string {
  return String(code ?? "").toUpperCase();
}

function getCourierConfigFields(code?: string): ConfigField[] {
  const courierCode = normalizeCourierCode(code);

  if (courierCode in COURIER_CONFIG_FIELDS) {
    return COURIER_CONFIG_FIELDS[courierCode as CourierProviderCode];
  }

  return [];
}

function buildInitialValues(
  configs: CourierConfigResponse[],
): CourierConfigFormValues {
  return {
    configs: configs.map((item) => {
      const provider = normalizeCourierCode(item.courier?.code);
      const fields = getCourierConfigFields(provider);

      const configData = fields.reduce<CourierConfigData>((acc, field) => {
        acc[field.name] = item.configData?.[field.name] ?? "";
        return acc;
      }, {});

      return {
        configId: item.id,
        courierId: item.courierId,
        provider,
        mode: item.mode ?? "SANDBOX",
        status: item.status ?? "INACTIVE",
        rotateWebhookToken: false,
        configData,
      };
    }),
  };
}

function cleanConfigData(
  provider: string,
  configData: CourierConfigData,
): CourierConfigData {
  const fields = getCourierConfigFields(provider);

  return fields.reduce<CourierConfigData>((acc, field) => {
    acc[field.name] = configData?.[field.name]?.trim?.() ?? "";
    return acc;
  }, {});
}

function CourierStatusSwitch({
  form,
  index,
}: {
  form: FormInstance<CourierConfigFormValues>;
  index: number;
}) {
  const status = Form.useWatch(["configs", index, "status"], form);
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
        name={["configs", index, "status"]}
        getValueProps={(value: CourierStatus) => ({
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

export default function CourierConfig() {
  const [form] = Form.useForm<CourierConfigFormValues>();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: courier,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierQuery(businessId);

  const { courierBulkUpdate } = useCourierMutation(businessId);

  const courierConfigs = useMemo(() => {
    const response = courier as any;

    if (Array.isArray(response)) {
      return response as CourierConfigResponse[];
    }

    if (Array.isArray(response?.items)) {
      return response.items as CourierConfigResponse[];
    }

    if (Array.isArray(response?.data)) {
      return response.data as CourierConfigResponse[];
    }

    if (Array.isArray(response?.configs)) {
      return response.configs as CourierConfigResponse[];
    }

    return [];
  }, [courier]);

  useEffect(() => {
    if (!courierConfigs.length) return;

    form.setFieldsValue(buildInitialValues(courierConfigs));
  }, [form, courierConfigs]);

  const isLoading = courierLoading || courierFetching;
  const isSaving = courierBulkUpdate?.isPending;

  const handleSubmit = async () => {
    const values = form.getFieldsValue(true) as CourierConfigFormValues;

    const payload: UpdateCourierConfigPayload = {
      configs: values.configs.map((item) => ({
        configData: cleanConfigData(item.provider, item.configData),
        mode: item.mode,
        status: item.status,
        rotateWebhookToken: item.rotateWebhookToken,
        configId: item.configId,
      })),
    };

    try {
      await courierBulkUpdate.mutateAsync(payload);

      swal.success("Courier configurations updated successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const collapseItems: CollapseProps["items"] = courierConfigs.map(
    (courierItem, index) => {
      const provider = normalizeCourierCode(courierItem.courier?.code);
      const configFields = getCourierConfigFields(provider);

      return {
        key: courierItem.id,
        forceRender: true,

        label: (
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 sm:size-10">
              <Truck size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                {courierItem.courier?.name}
              </div>

              <div className="mt-0.5 hidden truncate text-[11px] text-gray-500 sm:block">
                {courierItem.courier?.description}
              </div>

              <div className="mt-1 inline-flex max-w-full rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                <span className="truncate">{provider}</span>
              </div>
            </div>
          </div>
        ),

        extra: <CourierStatusSwitch form={form} index={index} />,

        children: (
          <div className="space-y-4 sm:space-y-5">
            <Form.Item name={["configs", index, "configId"]} hidden>
              <Input />
            </Form.Item>

            <Form.Item name={["configs", index, "courierId"]} hidden>
              <Input />
            </Form.Item>

            <Form.Item name={["configs", index, "provider"]} hidden>
              <Input />
            </Form.Item>

            <Card
              size="small"
              className="rounded-2xl border border-gray-100 shadow-sm"
              title={
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-orange-600" />
                  <span className="text-xs font-semibold sm:text-sm">
                    Courier Setup
                  </span>
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Form.Item
                  label="Courier Mode"
                  name={["configs", index, "mode"]}
                  rules={[
                    {
                      required: true,
                      message: "Courier mode is required",
                    },
                  ]}
                >
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    className="grid w-full grid-cols-2 gap-2"
                  >
                    <Radio.Button value="SANDBOX" className="text-center">
                      SANDBOX
                    </Radio.Button>

                    <Radio.Button value="LIVE" className="text-center">
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
                    Add courier credential values for{" "}
                    {courierItem.courier?.name}.
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
                          "configs",
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
                        <InputComponent
                          placeholder={field.placeholder}
                          autoComplete={
                            field.secret ? "new-password" : undefined
                          }
                        />
                      </Form.Item>
                    );
                  })}
                </div>
              ) : (
                <Alert
                  type="warning"
                  showIcon
                  message="Unsupported courier"
                  description={`No credential fields are configured for provider code: ${provider}`}
                />
              )}
            </Card>

            <Form.Item
              label="Webhook Token"
              name={["configs", index, "rotateWebhookToken"]}
              valuePropName="checked"
              extra="Enable this only if you want to generate a new webhook token."
            >
              <Checkbox>
                Do you want to rotate the webhook token?
              </Checkbox>
            </Form.Item>

            {/* <Alert
              type={courierItem.webhookConfigured ? "success" : "info"}
              showIcon
              message={
                courierItem.webhookConfigured
                  ? "Webhook configured"
                  : "Webhook not configured"
              }
              description={
                courierItem.webhookUrlHint ||
                "Webhook URL hint is not available."
              }
            /> */}
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
        title="Courier Configurations"
        subtitle="Create and manage courier credentials, mode, status, and webhook configuration."
        breadcrumb={adminBreadcrumb}
      />

      <Card className="rounded-2xl shadow-sm">
        {isLoading ? (
          <Loader />
        ) : !courierConfigs.length ? (
          <Empty description="No courier configuration found" />
        ) : (
          <Form
            form={form}
            layout="vertical"
            preserve
            onFinish={handleSubmit}
            initialValues={buildInitialValues(courierConfigs)}
            className="courier-config-form"
          >
            <Collapse
              accordion
              bordered={false}
              destroyOnHidden={false}
              items={collapseItems}
              defaultActiveKey={courierConfigs[0]?.id}
              className="courier-config-collapse bg-transparent"
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