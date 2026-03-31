"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Card, Row, Col, Tag, Typography, Divider, Image } from "antd";

const { Title, Text, Paragraph } = Typography;

// Example product data
const productData = {
  id: 3,
  tenant_id: 101,
  company_id: 1001,
  brand_id: 502,
  category_id: 203,
  name: "USB-C Charger",
  slug: "usb-c-charger",
  sku: "UC-003",
  barcode: "9876543210987",
  short_description: "Fast charging USB-C adapter",
  long_description: "High-speed USB-C charger compatible with multiple devices.",
  cost_price: 10.0,
  sale_price: 18.0,
  compare_price: 20.0,
  tax_type: "VAT",
  tax_amount: 1.5,
  weight: 0.1,
  status: "Inactive",
  is_featured: false,
  published_at: null,
  image_url: "https://via.placeholder.com/300x300.png?text=USB-C+Charger", // placeholder image
};

export default function ProductDetailPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <PageHeader title="Product Details" breadcrumb={adminBreadcrumb} />
      </div>

      <Card>
        <Row gutter={24}>
          {/* Product Image */}
          <Col xs={24} md={8}>
            <Image
              src={productData.image_url}
              alt={productData.name}
              width="100%"
              style={{ borderRadius: 8 }}
            />
          </Col>

          {/* Product Info */}
          <Col xs={24} md={16}>
            <Title level={3}>{productData.name}</Title>
            <Paragraph>{productData.short_description}</Paragraph>

            <Divider />

            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>SKU:</Text> <Text>{productData.sku}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Barcode:</Text> <Text>{productData.barcode || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Cost Price:</Text> <Text>${productData.cost_price}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Sale Price:</Text> <Text>${productData.sale_price}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Compare Price:</Text>{" "}
                <Text>{productData.compare_price ? `$${productData.compare_price}` : "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Tax:</Text> <Text>{productData.tax_type} {productData.tax_amount ? `(${productData.tax_amount})` : ""}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Weight:</Text> <Text>{productData.weight} kg</Text>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>{" "}
                <Tag color={productData.status === "Active" ? "green" : "red"}>
                  {productData.status}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Featured:</Text> <Text>{productData.is_featured ? "Yes" : "No"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Published At:</Text>{" "}
                <Text>{productData.published_at || "Not Published"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Brand ID:</Text> <Text>{productData.brand_id || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Category ID:</Text> <Text>{productData.category_id}</Text>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Long Description</Title>
            <Paragraph>{productData.long_description}</Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
}