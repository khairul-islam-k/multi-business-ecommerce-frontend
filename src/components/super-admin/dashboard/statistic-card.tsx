"use client";

import { theme, Card, Typography, Flex } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

type StatisticCardData = {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
};

type StatisticCardProps = {
  statistic: StatisticCardData;
};

export default function StatisticCard({ statistic }: StatisticCardProps) {
  const { token } = theme.useToken();

  return (
    <Card styles={{ body: { padding: 16 } }}>
      <Flex vertical gap={6}>
        <Flex vertical gap={4}>
          <Text
            type="secondary"
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {statistic.label}
          </Text>
        </Flex>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {statistic.value}
        </Text>

        <Flex vertical gap={2}>
          <Flex align="center" gap={4}>
            {statistic.up ? (
              <ArrowUpOutlined style={{ color: token.colorSuccess }} />
            ) : (
              <ArrowDownOutlined style={{ color: token.colorError }} />
            )}

            <Text
              style={{
                fontSize: 12,
                color: statistic.up ? token.colorSuccess : token.colorError,
              }}
            >
              {statistic.change}
            </Text>
          </Flex>

          <Text type="secondary" style={{ fontSize: 12 }}>
            from last month
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
