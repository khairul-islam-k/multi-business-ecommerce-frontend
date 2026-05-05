"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Progress,
  Row,
  Space,
  Typography,
} from "antd";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const UsageLimit = () => {
  const { Text } = Typography;

  const screens = Grid.useBreakpoint();

  const usageData = [
    { name: "Products", used: 450, limit: 1000, color: "#6467f2" },
    { name: "Orders/mo", used: 2000, limit: 5000, color: "#6467f2" },
    { name: "Usage", used: 8, limit: 10, color: "#f97415" },
    { name: "Storage (GB)", used: 8, limit: 10, color: "#6467f2" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Usage & Limit"
          breadcrumb={superAdminBreadcrumb}
        ></PageHeader>
      </div>
      <p>Monitor your plan usage and resource limits.</p>

      <Row gutter={[16, 16]}>
        {usageData.map((u) => (
          <Col xs={24} sm={24} md={12} key={u.name}>
            <Card>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text>{u.name}</Text>
                <Text>
                  {u.used}/{u.limit}
                </Text>
              </Space>

              <Progress
                percent={(u.used / u.limit) * 100}
                showInfo={false}
                size="medium"
                strokeColor={u.color}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: "16px" }}>
        <Flex
          align="center"
          justify="space-between"
          style={{ flexDirection: screens.xs ? "column" : "row" }}
        >
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 500 }}>
              Need more resources?
            </h3>
            <p>
              Upgrade your plan or purchase add-ons for additional capacity.
            </p>
          </div>
          <Space>
            <Button>
              <Link href="/admin/dashboard/billing/addons">View Addons</Link>
            </Button>
            <Button
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
              type="primary"
            >
              <Link href="/admin/dashboard/billing/upgrade-plan">
                Upgrade Plan
              </Link>
            </Button>
          </Space>
        </Flex>
      </Card>
    </div>
  );
};

export default UsageLimit;
