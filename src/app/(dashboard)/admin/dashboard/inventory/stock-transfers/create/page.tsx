"use client";

import { useRouter } from "next/navigation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Typography,
  Form as AntdForm,
  Select,
  Button,
  InputNumber,
  Input,
} from "antd";

import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { mockWarehouses, mockProducts } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function CreateStockTransferPage() {
  const router = useRouter();
  const swal = useSwal();
  const [form] = AntdForm.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading, handler } = useSubmit(async (values: any) => {
    console.log("TRANSFER:", values);

    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Stock transfer created");

    router.push("/admin/dashboard/inventory/stock-transfers");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Stock Transfer" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>Transfer Info</Title>

        <AntdForm
          form={form}
          layout="vertical"
          onFinish={handler}
          initialValues={{ items: [{}] }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="from_warehouse_id"
                label="From Warehouse"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select source warehouse"
                  options={mockWarehouses.map((w) => ({
                    label: w.name,
                    value: w.id,
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="to_warehouse_id"
                label="To Warehouse"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select destination warehouse"
                  options={mockWarehouses.map((w) => ({
                    label: w.name,
                    value: w.id,
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <AntdForm.Item name="note" label="Note">
                <Input.TextArea rows={2} />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <Title level={5}>Transfer Items</Title>
            </Col>

            <Col span={24}>
              <AntdForm.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={16} key={key} align="middle">
                        <Col xs={24} md={10}>
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

                        <Col xs={24} md={8}>
                          <AntdForm.Item
                            {...restField}
                            name={[name, "qty"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              placeholder="Quantity"
                              style={{ width: "100%" }}
                            />
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
                  Create Transfer
                </Button>
              </div>
            </Col>
          </Row>
        </AntdForm>
      </Card>
    </div>
  );
}
