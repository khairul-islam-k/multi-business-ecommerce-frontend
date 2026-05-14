"use client";

import { Button, Card, Flex, InputNumber, Tag, Typography } from "antd";
import { useState } from "react";

import type { PackageAddon, PackageSubscriptionAddon } from "@/lib/api";
import { money, optionLabel } from "../_utils/package-display";

const { Text, Title } = Typography;

type AddonCardProps = {
  addon: PackageAddon;
  activeAddon?: PackageSubscriptionAddon;
  checkoutLoading?: boolean;
  removeLoading?: boolean;
  onCheckout: (addon: PackageAddon, quantity: number) => void;
  onRemove: (subscriptionAddon: PackageSubscriptionAddon) => void;
};

export default function AddonCard({
  addon,
  activeAddon,
  checkoutLoading,
  removeLoading,
  onCheckout,
  onRemove,
}: AddonCardProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="h-full">
      <Flex vertical gap={12} className="h-full">
        <div>
          <Flex justify="space-between" gap={8}>
            <Title level={4} style={{ margin: 0 }}>
              {addon.name}
            </Title>
            {activeAddon && <Tag color="green">Active</Tag>}
          </Flex>
          {addon.description && (
            <Text type="secondary">{addon.description}</Text>
          )}
        </div>

        <div>
          <Text strong>{money(addon.price, addon.currencyCode)}</Text>
          <Text type="secondary">/{optionLabel(addon.billingCycle)}</Text>
        </div>

        <Text>
          {optionLabel(addon.limitKey)} +{addon.limitValue}
        </Text>

        <div className="flex-1" />

        {activeAddon ? (
          <Button
            danger
            block
            loading={removeLoading}
            onClick={() => onRemove(activeAddon)}
          >
            Remove add-on
          </Button>
        ) : (
          <Flex gap={8}>
            <InputNumber
              min={1}
              precision={0}
              value={quantity}
              onChange={(value) => setQuantity(value ?? 1)}
              style={{ width: 96 }}
            />
            <Button
              block
              type="primary"
              loading={checkoutLoading}
              onClick={() => onCheckout(addon, quantity)}
            >
              Add to plan
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
