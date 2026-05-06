"use client";

import { Card, Button, Typography, Row, Col, Tag } from "antd";

import { mockAddons } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

export default function AddOnsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Add-ons" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]} className="mt-6">
        {mockAddons.map((item, i) => (
          <Col xs={24} md={12} lg={8} key={i}>
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <Text strong>{item.title}</Text>
                {item.active && <Tag color="green">Active</Tag>}
              </div>

              <Text type="secondary">{item.desc}</Text>

              <div className="mt-4">
                <Text strong>{item.price}</Text>
              </div>

              <div className="mt-4">
                {item.active ? (
                  <Button block>Remove</Button>
                ) : (
                  <Button type="primary" block>
                    Add to Plan
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
