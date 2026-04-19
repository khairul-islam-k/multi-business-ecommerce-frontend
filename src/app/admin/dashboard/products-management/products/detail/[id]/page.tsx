"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import { Card, Row, Col, Tag, Typography, Divider, Image } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TProduct } from "../../page";

const { Title, Text, Paragraph } = Typography;

export default function ProductDetailPage() {
  const {id} = useParams();
  const [productData, setProductData] = useState<TProduct>()
  
  useEffect(() => {
    api.get(`/products/${id}`)
    .then(res => setProductData(res.data))
  }, [id])

  if (!productData) {
    return <div>loading...</div>
  }
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