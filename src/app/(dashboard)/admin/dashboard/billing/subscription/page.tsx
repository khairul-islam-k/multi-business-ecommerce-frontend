"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Switch,
  Divider,
  Flex,
} from "antd";

import { mockPlan } from "./data";
import Feature from "./_components/feature";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="p-6">
      <PageHeader title="Subscription" breadcrumb={adminBreadcrumb} />

      <Row gutter={16} className="mt-6">
        {/* LEFT */}
        <Col xs={24} lg={16}>
          <Card>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <Title level={4} className="mb-0">
                  {mockPlan.name} Plan
                </Title>
                <Text type="secondary">Your current active subscription</Text>
              </div>

              <Tag color="green">Active</Tag>
            </div>

            {/* BILLING TOGGLE */}
            <div className="flex items-center gap-3 mb-4">
              <Text>Monthly</Text>
              <Switch checked={yearly} onChange={setYearly} />
              <Text>Yearly</Text>
              <Tag color="green">Save 20%</Tag>
            </div>

            {/* PLAN META */}
            <Row gutter={16} className="mb-4">
              <Col span={6}>
                <Text type="secondary">Price</Text>
                <div>
                  {yearly ? mockPlan.yearly : mockPlan.monthly}/
                  {yearly ? "year" : "month"}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Billing Cycle</Text>
                <div>{yearly ? "Yearly" : "Monthly"}</div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Start Date</Text>
                <div>Jan 15, 2026</div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Renewal Date</Text>
                <div>Apr 15, 2026</div>
              </Col>
            </Row>

            <Divider />

            {/* FEATURES */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                {mockPlan.features
                  .slice(0, Math.ceil(mockPlan.features.length / 2))
                  .map((f, i) => (
                    <Feature key={i} text={f} />
                  ))}
              </Col>

              <Col xs={24} md={12}>
                {mockPlan.features
                  .slice(Math.ceil(mockPlan.features.length / 2))
                  .map((f, i) => (
                    <Feature key={i} text={f} />
                  ))}
              </Col>
            </Row>

            <Divider />

            {/* AUTO RENEW */}
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Auto-Renew</Text>
                <div>
                  <Text type="secondary">
                    Automatically renew your subscription.
                  </Text>
                </div>
              </div>

              <Switch defaultChecked />
            </div>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={8}>
          <Card className="mb-4">
            <Flex vertical gap={8}>
              <Title level={5}>Quick Actions</Title>

              <Button type="primary" block>
                Upgrade Plan
              </Button>

              <Button block>View Add-ons</Button>

              <Button block>Billing History</Button>
            </Flex>
          </Card>

          <Card>
            <Button danger block>
              Cancel Subscription
            </Button>

            <Text type="secondary" className="block mt-2 text-center">
              Access continues until the end of your billing period.
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
