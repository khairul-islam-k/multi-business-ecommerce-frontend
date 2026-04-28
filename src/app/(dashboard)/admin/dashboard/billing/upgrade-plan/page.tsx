"use client";

import { useState } from "react";
import { Card, Typography, Row, Col, Button, Switch, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { mockPlans } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

export default function UpgradePlanPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="p-6">
      <PageHeader title="Upgrade Plan" breadcrumb={adminBreadcrumb} />

      {/* TOGGLE */}
      <div className="flex items-center gap-3 my-4 w-fit mx-auto">
        <Text>Monthly</Text>
        <Switch checked={yearly} onChange={setYearly} />
        <Text>Yearly</Text>
        <Tag color="green">Save 20%</Tag>
      </div>

      <Row gutter={[16, 16]}>
        {mockPlans.map((plan, i) => (
          <Col xs={24} md={12} lg={8} key={i}>
            <Card
              className={`h-full flex flex-col ${
                plan.current ? "border border-blue-500" : ""
              }`}
            >
              {/* HEADER */}
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">
                    {plan.name}
                  </Title>
                  {plan.current && <Tag color="blue">Current</Tag>}
                </div>

                <Text type="secondary">{plan.desc}</Text>
              </div>

              {/* PRICE */}
              <div className="mb-4">
                {plan.custom ? (
                  <Title level={4}>Custom</Title>
                ) : (
                  <>
                    <Title level={3} className="mb-0">
                      {yearly ? plan.yearly : plan.monthly}
                    </Title>
                    <Text type="secondary">/{yearly ? "year" : "month"}</Text>
                  </>
                )}
              </div>

              {/* INCLUDED */}
              <div className="flex-1">
                <Text strong>Includes:</Text>

                <div className="mt-2">
                  {plan.included.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <CheckOutlined className="text-green-500" />
                      <Text>{f}</Text>
                    </div>
                  ))}
                </div>

                {/* EXCLUDED */}
                {plan.excluded && (
                  <>
                    <div className="mt-4">
                      <Text strong>Not included:</Text>
                    </div>

                    <div className="mt-2">
                      {plan.excluded.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <CloseOutlined className="text-red-400" />
                          <Text type="secondary">{f}</Text>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ACTION */}
              <div className="mt-6">
                {plan.current ? (
                  <Button block disabled>
                    Current Plan
                  </Button>
                ) : plan.custom ? (
                  <Button type="primary" block>
                    Contact Sales
                  </Button>
                ) : (
                  <Button type="primary" block>
                    Upgrade
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
