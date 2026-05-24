"use client";

import { useAttributeMutation, useProductAttribute } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { useState } from "react";

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

  // mutation
  const {
    createAttributeValue,
    updateAttributeValue,
    removeAttributeValue
  } = useAttributeMutation(businessId);

  const handleOpenAddValue = (attributeId: string) => {
    setValueMode("add");
    setSelectedAttributeId(attributeId);
    setSelectedValueId(null);

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

    form.setFieldsValue({
      value: valueItem.value,
    });

    setValueModalOpen(true);
  };

  const handleSubmitValue = async (values: ValueFormValues) => {
    const payload = {
      value: values.value.trim(),
    };

    if (valueMode === "add") {

      try {
        const res = await createAttributeValue.mutateAsync({
          productId,
          attributeId: selectedAttributeId!,
          payload
        })
        message.success('Add value successfully');
      } catch (error) {
        message.error(getApiErrorMessage(error));
      }
    }

    if (valueMode === "update") {
      try {
        const res = await updateAttributeValue.mutateAsync({
          productId,
          attributeId: selectedAttributeId!,
          valueId: selectedValueId!,
          payload
        })
        message.success('Update Attribute value Successfully');
      } catch (error) {
        message.error(getApiErrorMessage(error));
      }
    }

    form.resetFields();
    setValueModalOpen(false);
    setSelectedAttributeId(null);
    setSelectedValueId(null);
  };

  const handleDeleteValue = async (attributeId: string, valueId: string) => {

    try {
      const res = await removeAttributeValue.mutateAsync({
        productId,
        attributeId,
        valueId
      })
      console.log('res', res);
      message.success('Attribute Value has been deleted')
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setValueModalOpen(false);
    setSelectedAttributeId(null);
    setSelectedValueId(null);
  };

  if (isLoading || isFetching) {
    return (
      <Card title="Attributes">
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  if (!attributes?.length) {
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
          {(attributes as ProductAttribute[]).map((attribute) => (
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
                  <span className="text-gray-400">No value</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={valueModalOpen}
        title={valueMode === "add" ? "Add Attribute Value" : "Update Attribute Value"}
        onCancel={handleCloseModal}
        footer={null}
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
            <Input placeholder="Red" />
          </Form.Item>

          <Space className="flex justify-end">
            <Button onClick={handleCloseModal}>Cancel</Button>

            <Button type="primary" htmlType="submit">
              {valueMode === "add" ? "Add Value" : "Update Value"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default ViewAttribute;