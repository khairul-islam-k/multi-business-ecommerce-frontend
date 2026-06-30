"use client";

import { Alert, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

import type { FinanceAccountResponse } from "@/types/finance/account";
import type {
  PaymentGatewayConfig,
  PaymentGatewayConfigPayload,
  PaymentGatewayMode,
  PaymentGatewayProvider,
  PaymentGatewayStatus,
} from "@/types/payment-gateway";

const providerOptions: Array<{ label: string; value: PaymentGatewayProvider }> =
  [
    { label: "SSLCommerz", value: "SSLCOMMERZ" },
    { label: "AamarPay", value: "AAMARPAY" },
    { label: "SurjoPay", value: "SHURJOPAY" },
  ];

const modeOptions: Array<{ label: string; value: PaymentGatewayMode }> = [
  { label: "Sandbox", value: "SANDBOX" },
  { label: "Live", value: "LIVE" },
];

const statusOptions: Array<{ label: string; value: PaymentGatewayStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

type FormValues = Omit<PaymentGatewayConfigPayload, "configData"> & {
  configDataText: string;
};

type PaymentGatewayConfigModalProps = {
  open: boolean;
  mode: "create" | "update";
  config?: PaymentGatewayConfig | null;
  financeAccounts: FinanceAccountResponse[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: PaymentGatewayConfigPayload) => Promise<void> | void;
};

const defaultConfigData = {
  storeId: "",
};

export default function PaymentGatewayConfigModal({
  open,
  mode,
  config,
  financeAccounts,
  loading,
  onCancel,
  onSubmit,
}: PaymentGatewayConfigModalProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      provider: config?.provider ?? "SSLCOMMERZ",
      financeAccountId: config?.financeAccountId,
      mode: config?.mode ?? "SANDBOX",
      status: config?.status ?? "ACTIVE",
      configDataText: JSON.stringify(
        config?.configData ?? defaultConfigData,
        null,
        2,
      ),
    });
  }, [config, form, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const configData = JSON.parse(values.configDataText) as Record<
      string,
      unknown
    >;

    await onSubmit({
      provider: values.provider,
      financeAccountId: values.financeAccountId,
      mode: values.mode,
      status: values.status,
      configData,
    });
  };

  return (
    <Modal
      title={
        mode === "create"
          ? "Configure Payment Gateway"
          : "Update Payment Gateway"
      }
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={mode === "create" ? "Create configuration" : "Save changes"}
      width={720}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        className="mb-4"
        message="Configuration data is provider-specific JSON."
        description="Use the exact credential keys expected by the backend/provider. The API currently accepts this as a configData object."
      />

      <Form form={form} layout="vertical" requiredMark>
        <Form.Item
          name="provider"
          label="Payment provider"
          rules={[{ required: true, message: "Payment provider is required" }]}
        >
          <Select options={providerOptions} />
        </Form.Item>

        <Form.Item
          name="financeAccountId"
          label="Settlement finance account"
          tooltip="Payments received through this gateway will be associated with this finance account."
          rules={[
            {
              required: true,
              message: "Settlement finance account is required",
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="Select finance account"
            options={financeAccounts.map((account) => ({
              label: `${account.name} - ${account.accountType.replaceAll("_", " ")}`,
              value: account.id,
            }))}
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="mode"
            label="Gateway mode"
            rules={[{ required: true, message: "Gateway mode is required" }]}
          >
            <Select options={modeOptions} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select options={statusOptions} />
          </Form.Item>
        </div>

        <Form.Item
          name="configDataText"
          label="Provider config JSON"
          tooltip='Example: { "storeId": "merchant-id" }'
          rules={[
            { required: true, message: "Provider config JSON is required" },
            {
              validator: (_, value) => {
                try {
                  const parsed = JSON.parse(value || "");

                  if (
                    !parsed ||
                    Array.isArray(parsed) ||
                    typeof parsed !== "object"
                  ) {
                    return Promise.reject(
                      new Error("Config JSON must be an object"),
                    );
                  }

                  return Promise.resolve();
                } catch {
                  return Promise.reject(
                    new Error("Config JSON must be valid JSON"),
                  );
                }
              },
            },
          ]}
        >
          <Input.TextArea
            rows={8}
            spellCheck={false}
            placeholder={JSON.stringify(defaultConfigData, null, 2)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
