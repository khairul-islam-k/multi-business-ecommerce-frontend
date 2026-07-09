"use client";

import { Button, Card, Flex, Tag, theme, Typography } from "antd";
import { useState } from "react";

import { money, optionLabel } from "../_utils/package-display";

import type { PackagePlan } from "@/lib/api";

const { Text, Title } = Typography;

type PlanCardProps = {
  plan: PackagePlan;
  currentPlanId?: string;
  loading?: boolean;
  onCheckout: (plan: PackagePlan) => void;
};

export default function PlanCard({
  plan,
  currentPlanId,
  loading,
  onCheckout,
}: PlanCardProps) {
  const { token } = theme.useToken();
  const isCurrent = plan.id === currentPlanId;
  const [loadingId, setLoadingId] = useState<string>("");

  const cardLoading = loadingId === plan.id && loading;

  return (
    <Card
      className="h-full"
      style={{
        borderColor: isCurrent
          ? token.colorPrimary
          : token.colorBorderSecondary,
        boxShadow: isCurrent ? `0 0 0 1px ${token.colorPrimary}` : undefined,
      }}
    >
      <Flex vertical gap={14} className="h-full">
        <div>
          <Flex justify="space-between" gap={8}>
            <Title level={4} style={{ margin: 0 }}>
              {plan.name}
            </Title>
            {isCurrent && <Tag color="blue">Current</Tag>}
            {plan.isDefault && !isCurrent && <Tag>Default</Tag>}
          </Flex>
          {plan.description && <Text type="secondary">{plan.description}</Text>}
        </div>

        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            {money(plan.price, plan.currencyCode)}
          </Title>
          <Text type="secondary">/{optionLabel(plan.billingCycle)}</Text>
        </div>

        <div className="flex-1 space-y-2">
          {plan.limits?.length ? (
            plan.limits.map((limit) => (
              <Flex key={limit.id ?? limit.limitKey} justify="space-between">
                <Text>{optionLabel(limit.limitKey)}</Text>
                <Text strong>{limit.limitValue}</Text>
              </Flex>
            ))
          ) : (
            <Text type="secondary">No limits configured.</Text>
          )}
        </div>

        <Button
          block
          type={isCurrent ? "default" : "primary"}
          disabled={isCurrent}
          loading={cardLoading}
          onClick={() => {
            onCheckout(plan);
            setLoadingId(plan.id);
          }}
        >
          {isCurrent ? "Current plan" : "Choose plan"}
        </Button>
      </Flex>
    </Card>
  );
}
