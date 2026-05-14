"use client";

import { Card, Progress, Typography } from "antd";

import type { PackageUsageSummaryItem } from "@/lib/api";
import { optionLabel } from "../_utils/package-display";

const { Text } = Typography;

export default function UsageCard({ item }: { item: PackageUsageSummaryItem }) {
  const percent = item.allowed
    ? Math.min(Math.round((item.used / item.allowed) * 100), 100)
    : 0;

  return (
    <Card>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Text strong>{optionLabel(item.limitKey)}</Text>
          <Text type="secondary">
            {item.used}/{item.allowed}
          </Text>
        </div>
        <Progress percent={percent} />
        <Text type="secondary">
          Remaining: {item.remaining} | Live: {item.liveUsed} | Consumed:{" "}
          {item.consumed}
        </Text>
      </div>
    </Card>
  );
}
