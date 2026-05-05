"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Tag, Typography, Divider, Spin } from "antd";

import api from "@/lib/axios";

const { Text, Title } = Typography;

const VariantDetail = () => {
  const { id } = useParams();
  console.log(id);

  const { data, isLoading } = useQuery({
    queryKey: ["variant", id],
    enabled: !!id,
    queryFn: async () => api.get(`/variant/${id}`),
  });

  const variant = data?.data?.data;

  if (isLoading) return <Spin size="large" />;

  if (!variant) return <Text>Variant not found</Text>;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>{variant.name}</Title>
          <Text type="secondary">SKU: {variant.sku}</Text>
        </Col>
        <Col>
          <Tag color={variant.status === "Active" ? "green" : "red"}>
            {variant.status}
          </Tag>
        </Col>
      </Row>

      <Divider />

      {/* Pricing Section */}
      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          <Title level={5}>Pricing</Title>
          <Text strong>Cost Price</Text>
          <div>${variant.cost_price}</div>

          <Text strong style={{ marginTop: 12, display: "block" }}>
            Sale Price
          </Text>
          <div>${variant.sale_price}</div>
        </Col>

        {/* Inventory */}
        <Col xs={24} md={12}>
          <Title level={5}>Inventory</Title>
          <Text strong>Stock Alert Qty</Text>
          <div>{variant.stock_alert_qty}</div>
        </Col>
      </Row>

      <Divider />

      {/* Meta Information */}
      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          <Title level={5}>Identifiers</Title>
          <Text strong>UUID</Text>
          <div style={{ wordBreak: "break-all" }}>{variant.uuid}</div>

          <Text strong style={{ marginTop: 12, display: "block" }}>
            Product ID
          </Text>
          <div>{variant.product_id}</div>
        </Col>

        <Col xs={24} md={12}>
          <Title level={5}>Audit</Title>
          <Text strong>Created At</Text>
          <div>{new Date(variant.createdAt).toLocaleString()}</div>

          <Text strong style={{ marginTop: 12, display: "block" }}>
            Updated At
          </Text>
          <div>{new Date(variant.updatedAt).toLocaleString()}</div>
        </Col>
      </Row>
    </Card>
  );
};

export default VariantDetail;
