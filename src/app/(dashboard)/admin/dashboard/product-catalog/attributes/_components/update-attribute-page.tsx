"use client";

import {
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
} from "antd";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ApiId } from "@/lib/api";
import {
  useAttribute,
  useAttributeMutation,
} from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  AttributeUpdatePayload,
  AttributeValuePayload,
} from "@/types/product/attribute";

import { UpdateAttributeName } from "../page";
import AttributeValueForm from "./attribute-value-form";

import type React from "react";

type UpdateAttributesPageProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  initialValue: UpdateAttributeName | undefined;
};

const UpdateAttributesPage = ({
  setIsModalOpen,
  initialValue,
}: UpdateAttributesPageProps) => {
  const [form] = Form.useForm<AttributeUpdatePayload>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valueModal, setValueModal] = useState(false);
  const [valueMode, setValueMode] = useState<"create" | "update">("create");
  const [valueInitialValues, setValueInitialValues] =
    useState<AttributeValuePayload>({ value: "" });
  const [valueId, setValueId] = useState<ApiId>("");
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const attributeId = initialValue?.id ?? "";

  const {
    data: attribute,
    isLoading,
    isFetching,
  } = useAttribute(businessId, attributeId);

  const {
    updateAttributeName,
    createAttributeValue,
    updateAttributeValue,
    removeAttributeValue,
  } = useAttributeMutation(businessId);

  useEffect(() => {
    if (!attribute) return;

    form.setFieldsValue({
      name: attribute.name ?? "",
      status: attribute.status ?? "ACTIVE",
    });
  }, [attribute, form]);

  const handleSubmit = async (values: AttributeUpdatePayload) => {
    if (!attributeId) return;

    setIsSubmitting(true);

    const payload: AttributeUpdatePayload = {
      name: values.name.trim(),
      status: values.status,
    };

    try {
      await updateAttributeName.mutateAsync({
        attributeId,
        payload,
      });
      message.success("Attribute updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateValue = async (value: AttributeValuePayload) => {
    if (!attributeId) return;

    try {
      await createAttributeValue.mutateAsync({
        attributeId,
        payload: {
          value: value.value,
        },
      });
      message.success("Attribute value created successfully");
      setValueModal(false);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleUpdateValue = async (value: AttributeValuePayload) => {
    if (!attributeId || !valueId) return;

    try {
      await updateAttributeValue.mutateAsync({
        attributeId,
        valueId,
        payload: {
          value: value.value,
        },
      });
      message.success("Attribute value updated successfully");
      setValueModal(false);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleDeleteValue = async (nextValueId: string) => {
    if (!attributeId) return;

    try {
      await removeAttributeValue.mutateAsync({
        attributeId,
        valueId: nextValueId,
      });
      message.success("Attribute value deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (isLoading || isFetching) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!attribute) {
    return (
      <Card>
        <Empty description="Attribute not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card title="Attribute Details">
        <Form<AttributeUpdatePayload>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Attribute Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Attribute name is required",
                },
              ]}
            >
              <Input placeholder="Color" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Status is required",
                },
              ]}
            >
              <Select
                placeholder="Select status"
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />
            </Form.Item>

            <InfoItem
              label="Total Values"
              value={attribute.values?.length ?? 0}
            />

            <InfoItem
              label="Created At"
              value={
                attribute.createdAt
                  ? new Date(attribute.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="mt-4"
          >
            Update Attribute
          </Button>
        </Form>
      </Card>

      <Card
        title="Attribute Values"
        extra={
          <Button
            type="primary"
            icon={<CirclePlus />}
            onClick={() => {
              setValueMode("create");
              setValueInitialValues({ value: "" });
              setValueId("");
              setValueModal(true);
            }}
          >
            Add Value
          </Button>
        }
      >
        {attribute.values?.length ? (
          <div className="space-y-3">
            {attribute.values.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 p-3"
              >
                <div>
                  <p className="m-0 font-medium">{item.value}</p>
                  <p className="m-0 text-xs text-gray-500">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    icon={<Pencil />}
                    onClick={() => {
                      setValueMode("update");
                      setValueInitialValues({ value: item.value });
                      setValueId(item.id);
                      setValueModal(true);
                    }}
                  />

                  <Popconfirm
                    title="Delete value?"
                    description="Are you sure?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleDeleteValue(item.id)}
                  >
                    <Button danger size="small" icon={<Trash2 />} />
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No attribute values found" />
        )}
      </Card>

      <Modal
        title={
          valueMode === "create"
            ? "Add Attribute Value"
            : "Edit Attribute Value"
        }
        open={valueModal}
        footer={null}
        onCancel={() => setValueModal(false)}
        destroyOnHidden
      >
        <AttributeValueForm
          mode={valueMode}
          initialValues={valueInitialValues}
          isSubmitting={
            createAttributeValue.isPending || updateAttributeValue.isPending
          }
          onSubmit={
            valueMode === "create" ? handleCreateValue : handleUpdateValue
          }
          onCancel={() => setValueModal(false)}
        />
      </Modal>
    </div>
  );
};

export default UpdateAttributesPage;

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  );
};
