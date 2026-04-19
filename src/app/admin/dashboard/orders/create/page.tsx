"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Select,
  Space,
  InputNumber,
  Divider,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { LineItem } from "./types";
import { mockProducts } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CreateOrder() {
  const router = useRouter();
  const swal = useSwal();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [channel, setChannel] = useState("Website");
  const [region, setRegion] = useState("North America");

  const [items, setItems] = useState<LineItem[]>([
    {
      product_id: "",
      product_name: "",
      sku: "",
      qty: 1,
      unit_price: 0,
    },
  ]);

  const addItem = () =>
    setItems([
      ...items,
      {
        product_id: "",
        product_name: "",
        sku: "",
        qty: 1,
        unit_price: 0,
      },
    ]);

  const removeItem = (i: number) =>
    setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (
    i: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );
  };

  const handleProductChange = (i: number, productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;

    updateItem(i, "product_id", product.id);
    updateItem(i, "product_name", product.name);
    updateItem(i, "sku", product.sku);
    updateItem(i, "unit_price", product.price);
  };

  const total = items.reduce(
    (sum, item) => sum + item.qty * item.unit_price,
    0,
  );

  const { handler: handleSubmit, loading } = useSubmit(async () => {
    await Promise.resolve(() => setTimeout(() => {}, 1000));
    swal.success("Created order.");
    router.push("/admin/dashboard/orders");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Order" breadcrumb={adminBreadcrumb} />

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            <Card title="Customer Information">
              <Row gutter={16}>
                <Col span={12}>
                  <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </Col>
              </Row>
            </Card>

            <Card
              title="Line Items"
              extra={
                <Button icon={<PlusOutlined />} onClick={addItem} size="small">
                  Add Item
                </Button>
              }
            >
              <Space orientation="vertical" style={{ width: "100%" }}>
                {items.map((item, i) => (
                  <Row key={i} gutter={8} align="middle">
                    <Col flex="auto">
                      <Select
                        placeholder="Select product"
                        value={item.product_id || undefined}
                        onChange={(val) => handleProductChange(i, val)}
                        style={{ width: "100%" }}
                        showSearch
                        optionFilterProp="children"
                      >
                        {mockProducts.map((p) => (
                          <Option key={p.id} value={p.id}>
                            {p.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>

                    <Col style={{ width: 120 }}>
                      <Input value={item.sku} disabled />
                    </Col>

                    <Col style={{ width: 100 }}>
                      <InputNumber
                        min={1}
                        value={item.qty}
                        onChange={(val) => updateItem(i, "qty", val || 1)}
                        style={{ width: "100%" }}
                      />
                    </Col>

                    <Col style={{ width: 120 }}>
                      <InputNumber
                        min={0}
                        step={0.01}
                        value={item.unit_price}
                        onChange={(val) =>
                          updateItem(i, "unit_price", val || 0)
                        }
                        style={{ width: "100%" }}
                      />
                    </Col>

                    <Col>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeItem(i)}
                        disabled={items.length === 1}
                      />
                    </Col>
                  </Row>
                ))}
              </Space>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card title="Order Details">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Select value={channel} onChange={setChannel}>
                  {[
                    "Website",
                    "Mobile App",
                    "Marketplace",
                    "Wholesale",
                    "Social Media",
                  ].map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>

                <Select value={region} onChange={setRegion}>
                  {[
                    "North America",
                    "Europe",
                    "Asia Pacific",
                    "Middle East",
                    "Latin America",
                  ].map((r) => (
                    <Option key={r} value={r}>
                      {r}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text type="secondary">Total</Text>
                  <Title level={4}>${total.toFixed(2)}</Title>
                </div>

                <Divider />

                <Button
                  type="primary"
                  block
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Create Order
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
