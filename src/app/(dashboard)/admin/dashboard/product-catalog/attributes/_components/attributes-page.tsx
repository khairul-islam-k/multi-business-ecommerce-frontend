"use client";

import { App, Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import { CirclePlus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { useAttributeMutation } from "@/lib/api/hooks/product-attribute";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

export type AttributeStatus = "ACTIVE" | "INACTIVE";

export type AttributeValuePayload = {
  value: string;
};

export type AttributePayload = {
  name: string;
  status: AttributeStatus;
  values: AttributeValuePayload[];
};

type CreateAttributesPageProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const CreateAttributesPage = ({
  setIsModalOpen,
}: CreateAttributesPageProps) => {
  const [form] = Form.useForm<AttributePayload>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";

  const { createAttribute } = useAttributeMutation(businessId);

  const handleSubmit = async (values: AttributePayload) => {
    setIsSubmitting(true);
    const payload: AttributePayload = {
      name: values.name.trim(),
      status: values.status,
      values:
        values.values
          ?.filter((item) => item.value?.trim())
          .map((item) => ({
            value: item.value.trim(),
          })) ?? [],
    };

    try {
      await createAttribute.mutateAsync(payload);
      message.success("Attribute Created successfully");
      setIsModalOpen(false);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
      form.resetFields();
    }
  };

  return (
    <Card title="Create Product Attribute">
      <Form<AttributePayload>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: "",
          status: "ACTIVE",
          values: [
            {
              value: "",
            },
          ],
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
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
          </Col>

          <Col xs={24} md={12}>
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
                  {
                    label: "Active",
                    value: "ACTIVE",
                  },
                  {
                    label: "Inactive",
                    value: "INACTIVE",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="values">
          {(fields, { add, remove }) => (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="m-0 text-base font-medium">Attribute Values</h3>

                <Button
                  type="dashed"
                  size="small"
                  icon={<CirclePlus />}
                  onClick={() => add({ value: "" })}
                >
                  Add Value
                </Button>
              </div>

              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" className="mb-3 mr-5">
                  <Form.Item
                    name={[field.name, "value"]}
                    rules={[
                      {
                        required: index === 0,
                        message: "Value is required",
                      },
                    ]}
                    className="mb-0 w-full"
                  >
                    <Input placeholder="Red" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button
                      danger
                      icon={<Trash2 />}
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Space>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item className="mb-0 mt-6">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Create Attribute
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAttributesPage;
