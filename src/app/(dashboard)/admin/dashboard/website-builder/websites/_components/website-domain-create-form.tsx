"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Button, Card, Form, Input, Select, Space, Switch } from "antd";

import { useSwal } from "@/hooks/use-swal";
import { useWebsiteMutation } from "@/lib/api/hooks/website";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { ResponseWebsiteDomain, WebsiteDomainFormValues } from "@/types/website/website";

type WebsiteDomainCreateFormProps = {
  websiteId: string;
  activeSubDomain?: ResponseWebsiteDomain | null;
  setOpenDomainModal: Dispatch<SetStateAction<boolean>>;
};

const fallbackValues: WebsiteDomainFormValues = {
  domainType: "SUBDOMAIN",
  domain: "",
  subdomain: "",
  isPrimary: true,
  verificationStatus: "PENDING",
  sslStatus: "PENDING",
};

const WebsiteDomainCreateForm = ({
  websiteId,
  activeSubDomain,
  setOpenDomainModal,
}: WebsiteDomainCreateFormProps) => {
  const [form] = Form.useForm<WebsiteDomainFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const business = useAuthStore((state) => state.selectedBusiness);
  const businessId = business?.id ?? "";

  const swal = useSwal();
  const { addDomain } = useWebsiteMutation(businessId);

  const domainType = Form.useWatch("domainType", form);

  const defaultValues = useMemo<WebsiteDomainFormValues>(() => {
    if (!activeSubDomain) {
      return fallbackValues;
    }

    return {
      domainType: activeSubDomain.domainType ?? "SUBDOMAIN",
      domain: activeSubDomain.domain ?? "",
      subdomain: activeSubDomain.subdomain ?? "",
      isPrimary: activeSubDomain.isPrimary ?? true,
      verificationStatus:
        activeSubDomain.verificationStatus ?? "PENDING",
      sslStatus: activeSubDomain.sslStatus ?? "PENDING",
    };
  }, [activeSubDomain]);

  /*
   * Ant Design initialValues only works during the first render.
   * This updates the form when activeSubDomain arrives from the API.
   */
  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [defaultValues, form]);

  const handleDomainTypeChange = (
    value: WebsiteDomainFormValues["domainType"],
  ) => {
    if (value === "SUBDOMAIN") {
      form.setFieldValue("domain", "");
    } else {
      form.setFieldValue("subdomain", "");
    }
  };

  const handleFinish = async (values: WebsiteDomainFormValues) => {
    const isSubdomain = values.domainType === "SUBDOMAIN";

    const payload: WebsiteDomainFormValues = {
      domainType: values.domainType,
      domain: isSubdomain ? "" : values.domain?.trim() || "",
      subdomain: isSubdomain
        ? values.subdomain?.trim() || ""
        : "",
      isPrimary: values.isPrimary ?? false,
      verificationStatus:
        values.verificationStatus ?? "PENDING",
      sslStatus: values.sslStatus ?? "PENDING",
    };

    try {
      setIsSubmitting(true);

      await addDomain.mutateAsync({
        websiteId,
        payload,
      });

      swal.success("Domain added successfully.");
      setOpenDomainModal(false);
      form.resetFields();
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Create Website Domain" className="w-full">
      <Form<WebsiteDomainFormValues>
        form={form}
        layout="vertical"
        initialValues={fallbackValues}
        onFinish={handleFinish}
        requiredMark="optional"
      >
        <Form.Item
          label="Domain Type"
          name="domainType"
          rules={[
            {
              required: true,
              message: "Please select domain type",
            },
          ]}
        >
          <Select
            placeholder="Select domain type"
            onChange={handleDomainTypeChange}
            options={[
              {
                label: "Subdomain",
                value: "SUBDOMAIN",
              },
              {
                label: "Custom Domain",
                value: "CUSTOM_DOMAIN",
              },
            ]}
          />
        </Form.Item>

        {domainType === "SUBDOMAIN" ? (
          <Form.Item
            label="Subdomain"
            name="subdomain"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter subdomain",
              },
            ]}
          >
            <Input placeholder="second.192.168.0.122.nip.io" />
          </Form.Item>
        ) : (
          <Form.Item
            label="Custom Domain"
            name="domain"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter domain",
              },
            ]}
          >
            <Input placeholder="shop.example.com" />
          </Form.Item>
        )}

        <Form.Item
          label="Primary Domain"
          name="isPrimary"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Verification Status"
            name="verificationStatus"
            rules={[
              {
                required: true,
                message: "Please select verification status",
              },
            ]}
          >
            <Select
              placeholder="Select verification status"
              options={[
                {
                  label: "Pending",
                  value: "PENDING",
                },
                {
                  label: "Verified",
                  value: "VERIFIED",
                },
                {
                  label: "Failed",
                  value: "FAILED",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="SSL Status"
            name="sslStatus"
            rules={[
              {
                required: true,
                message: "Please select SSL status",
              },
            ]}
          >
            <Select
              placeholder="Select SSL status"
              options={[
                {
                  label: "Pending",
                  value: "PENDING",
                },
                {
                  label: "Active",
                  value: "ACTIVE",
                },
                {
                  label: "Failed",
                  value: "FAILED",
                },
              ]}
            />
          </Form.Item>
        </div>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            Add Domain
          </Button>

          <Button
            type="default"
            disabled={isSubmitting}
            onClick={() => setOpenDomainModal(false)}
          >
            Cancel
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default WebsiteDomainCreateForm;