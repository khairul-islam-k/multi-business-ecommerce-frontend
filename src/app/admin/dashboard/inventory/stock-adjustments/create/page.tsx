"use client";

import {
  Card,
  Col,
  Row,
  Typography,
  Form as AntdForm,
  Input,
  Select,
  Button,
  InputNumber,
  Space,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useSubmit from "@/hooks/use-submit";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

import { mockWarehouses, mockProducts } from "../data";

const { Title } = Typography;

export default function CreateStockAdjustmentPage() {
  const router = useRouter();
  const [form] = AntdForm.useForm();

  const { loading, handler } = useSubmit(async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Stock adjustment created");
    router.push("/admin/dashboard/inventory/stock-adjustments");
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Stock Adjustment"
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <Title level={5}>Adjustment Info</Title>

        <AntdForm
          form={form}
          layout="vertical"
          onFinish={handler}
          initialValues={{
            items: [{}],
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="warehouse_id"
                label="Warehouse"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select warehouse"
                  options={mockWarehouses.map((w) => ({
                    label: w.name,
                    value: w.id,
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="reason"
                label="Reason"
                rules={[{ required: true }]}
              >
                <Input placeholder="Reason for adjustment" />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <Title level={5}>Adjustment Items</Title>
            </Col>

            <Col span={24}>
              <AntdForm.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={16} key={key} align="middle">
                        <Col xs={24} md={6}>
                          <AntdForm.Item
                            {...restField}
                            name={[name, "product_id"]}
                            rules={[{ required: true }]}
                          >
                            <Select
                              placeholder="Product"
                              options={mockProducts.map((p) => ({
                                label: `${p.name} (${p.sku})`,
                                value: p.id,
                              }))}
                            />
                          </AntdForm.Item>
                        </Col>

                        <Col xs={24} md={5}>
                          <AntdForm.Item
                            {...restField}
                            name={[name, "old_qty"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              placeholder="Old Qty"
                              style={{ width: "100%" }}
                            />
                          </AntdForm.Item>
                        </Col>

                        <Col xs={24} md={5}>
                          <AntdForm.Item
                            {...restField}
                            name={[name, "new_qty"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              placeholder="New Qty"
                              style={{ width: "100%" }}
                            />
                          </AntdForm.Item>
                        </Col>

                        <Col xs={24} md={4}>
                          <AntdForm.Item
                            shouldUpdate={(prev, curr) =>
                              prev.items !== curr.items
                            }
                          >
                            {() => {
                              const oldQty = form.getFieldValue([
                                "items",
                                name,
                                "old_qty",
                              ]);
                              const newQty = form.getFieldValue([
                                "items",
                                name,
                                "new_qty",
                              ]);

                              const diff = (newQty || 0) - (oldQty || 0);

                              return (
                                <InputNumber
                                  value={diff}
                                  disabled
                                  style={{ width: "100%" }}
                                  placeholder="Diff"
                                />
                              );
                            }}
                          </AntdForm.Item>
                        </Col>

                        <Col xs={24} md={2}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Item
                    </Button>
                  </>
                )}
              </AntdForm.List>
            </Col>

            <Col span={24}>
              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Adjustment
                </Button>
              </div>
            </Col>
          </Row>
        </AntdForm>
      </Card>
    </div>
  );
}
