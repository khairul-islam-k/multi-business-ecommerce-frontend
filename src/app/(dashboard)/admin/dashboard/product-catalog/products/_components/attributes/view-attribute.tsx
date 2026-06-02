"use client";

import {
  useAttributeMutation,
  useProductAttribute,
} from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { contentQuotesLinter } from "@ant-design/cssinjs/lib/linters";
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  App,
  AutoComplete,
  Button,
  Card,
  Empty,
  Form,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";

type AttributeValue = {
  id: string;
  value: string;
};

type ProductAttribute = {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  values: AttributeValue[];
};

type ValueFormValues = {
  value: string;
};

interface ViewAttributeProps {
  productId: string;
}

const ViewAttribute = ({ productId }: ViewAttributeProps) => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();

  const [form] = Form.useForm<ValueFormValues>();

  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [valueMode, setValueMode] = useState<"add" | "update">("add");

  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(
    null
  );

  const [selectedValueId, setSelectedValueId] = useState<string | null>(null);

  const {
    data: attributes,
    isLoading,
    isFetching,
  } = useProductAttribute(businessId, productId);

  const {
    createAttributeValue,
    updateAttributeValue,
    removeAttributeValue,
  } = useAttributeMutation(businessId);

  const attributeList = (attributes ?? []) as ProductAttribute[];

  const attributeValueOptions = useMemo(() => {
    const uniqueValues = new Map<string, string>();

    attributeList.forEach((attribute) => {
      attribute.values?.forEach((item) => {
        const value = item.value?.trim();

        if (!value) return;

        const key = value.toLowerCase();

        if (!uniqueValues.has(key)) {
          uniqueValues.set(key, value);
        }
      });
    });

    console.log('memo', uniqueValues);

    return Array.from(uniqueValues.values()).map((value) => ({
      label: value,
      value,
    }));
  }, [attributeList]);

  const handleOpenAddValue = (attributeId: string) => {
    setValueMode("add");
    setSelectedAttributeId(attributeId);
    setSelectedValueId(null);

    form.resetFields();
    form.setFieldsValue({
      value: "",
    });

    setValueModalOpen(true);
  };

  const handleOpenUpdateValue = (
    attributeId: string,
    valueItem: AttributeValue
  ) => {
    setValueMode("update");
    setSelectedAttributeId(attributeId);
    setSelectedValueId(valueItem.id);

    form.resetFields();
    form.setFieldsValue({
      value: valueItem.value,
    });

    setValueModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setValueModalOpen(false);
    setSelectedAttributeId(null);
    setSelectedValueId(null);
  };

  const handleSubmitValue = async (values: ValueFormValues) => {
    if (!selectedAttributeId) {
      message.error("Attribute is required.");
      return;
    }

    const payload = {
      value: values.value.trim(),
    };

    if (!payload.value) {
      message.error("Value is required.");
      return;
    }

    try {
      if (valueMode === "add") {
        await createAttributeValue.mutateAsync({
          productId,
          attributeId: selectedAttributeId,
          payload,
        });

        message.success("Attribute value added successfully.");
      }

      if (valueMode === "update") {
        if (!selectedValueId) {
          message.error("Attribute value is required.");
          return;
        }

        await updateAttributeValue.mutateAsync({
          productId,
          attributeId: selectedAttributeId,
          valueId: selectedValueId,
          payload,
        });

        message.success("Attribute value updated successfully.");
      }

      handleCloseModal();
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleDeleteValue = async (attributeId: string, valueId: string) => {
    try {
      await removeAttributeValue.mutateAsync({
        productId,
        attributeId,
        valueId,
      });

      message.success("Attribute value deleted successfully.");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (isLoading || isFetching) {
    return (
      <Card title="Attributes">
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  if (!attributeList.length) {
    return (
      <Card title="Attributes">
        <Empty description="No attributes found" />
      </Card>
    );
  }

  return (
    <>
      <Card title="Attributes">
        <div className="space-y-3">
          {attributeList.map((attribute) => (
            <div key={attribute.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h4 className="m-0 font-medium capitalize">
                    {attribute.name}
                  </h4>

                  <Tag color={attribute.status === "ACTIVE" ? "green" : "red"}>
                    {attribute.status}
                  </Tag>
                </div>

                <Tooltip title="Add Value">
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenAddValue(attribute.id)}
                  >
                    Add Value
                  </Button>
                </Tooltip>
              </div>

              <div className="flex flex-wrap gap-2">
                {attribute.values?.length ? (
                  attribute.values.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-md border px-2 py-1"
                    >
                      <span className="text-sm font-medium">{item.value}</span>

                      <Tooltip title="Update Value">
                        <Button
                          size="small"
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() =>
                            handleOpenUpdateValue(attribute.id, item)
                          }
                        />
                      </Tooltip>

                      <Popconfirm
                        title="Delete value?"
                        description={`Are you sure you want to delete "${item.value}"?`}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() =>
                          handleDeleteValue(attribute.id, item.id)
                        }
                      >
                        <Tooltip title="Delete Value">
                          <Button
                            danger
                            size="small"
                            type="text"
                            icon={<CloseOutlined />}
                          />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No values added
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        title={valueMode === "add" ? "Add Attribute Value" : "Update Attribute Value"}
        open={valueModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        destroyOnHidden
      >
        <Form<ValueFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmitValue}
        >
          <Form.Item
            label="Value"
            name="value"
            rules={[
              {
                required: true,
                message: "Value is required",
              },
            ]}
          >
            <AutoComplete
              options={attributeValueOptions}
              placeholder="Red"
              allowClear
              filterOption={(inputValue, option) =>
                String(option?.value ?? "")
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>

          <Space className="flex justify-end">
            <Button onClick={handleCloseModal}>Cancel</Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={
                createAttributeValue.isPending ||
                updateAttributeValue.isPending
              }
            >
              {valueMode === "add" ? "Add Value" : "Update Value"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default ViewAttribute;