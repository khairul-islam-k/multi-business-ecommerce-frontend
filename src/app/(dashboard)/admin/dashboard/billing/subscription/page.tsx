"use client";

import { Button, Card, Col, Empty, Flex, Row, Tag, Typography } from "antd";
import {
  useTenantCurrentSubscription,
  useTenantPackageUsage,
} from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import UsageCard from "../_components/usage-card";
import {
  dateText,
  money,
  optionLabel,
  subscriptionStatusColor,
} from "../_utils/package-display";

const { Text, Title } = Typography;

export default function SubscriptionPage() {
  const subscription = useTenantCurrentSubscription();
  const usage = useTenantPackageUsage();

  if (subscription.isLoading) {
    return (
      <Loader
        label="Loading subscription"
        description="Fetching the current package subscription."
      />
    );
  }

  if (!subscription.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Subscription"
          subtitle="Review the current package subscription for this tenant."
          breadcrumb={adminBreadcrumb}
        />
        <Empty description="No current subscription was found." />
      </div>
    );
  }

  const current = subscription.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        subtitle="Review the current package subscription and usage."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card>
            <Flex justify="space-between" gap={16} wrap="wrap">
              <div>
                <Title level={4} style={{ marginBottom: 0 }}>
                  {current.package?.name ?? "Current package"}
                </Title>
                <Text type="secondary">
                  {money(current.price, current.currencyCode)} /
                  {optionLabel(current.billingCycle)}
                </Text>
              </div>
              <Tag color={subscriptionStatusColor[current.status]}>
                {optionLabel(current.status)}
              </Tag>
            </Flex>

            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={12} md={6}>
                <Text type="secondary">Started</Text>
                <div>{dateText(current.startedAt)}</div>
              </Col>
              <Col xs={12} md={6}>
                <Text type="secondary">Trial ends</Text>
                <div>{dateText(current.trialEndsAt)}</div>
              </Col>
              <Col xs={12} md={6}>
                <Text type="secondary">Period start</Text>
                <div>{dateText(current.currentPeriodStart)}</div>
              </Col>
              <Col xs={12} md={6}>
                <Text type="secondary">Period end</Text>
                <div>{dateText(current.currentPeriodEnd)}</div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Flex vertical gap={10}>
              <Title level={5}>Subscription actions</Title>
              <Button>
                <span className="font-semibold">
                  {money(current.price, current.currencyCode)} /{" "}
                  {optionLabel(current.billingCycle)}
                </span>
              </Button>
              <Button
                href="/admin/dashboard/billing/upgrade-plan"
                type="primary"
              >
                Change plan
              </Button>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {usage.isLoading ? (
          <Col span={24}>
            <Loader
              label="Loading usage"
              description="Calculating current package limits."
            />
          </Col>
        ) : usage.data?.length ? (
          usage.data.map((item) => (
            <Col xs={24} md={12} xl={6} key={item.limitKey}>
              <UsageCard item={item} />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="No usage limits are available." />
          </Col>
        )}
      </Row>

    </div>
  );
}
