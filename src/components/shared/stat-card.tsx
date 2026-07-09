import {
  ArrowDown,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";
import { Card, Space, Typography, theme } from "antd";

const { Text, Title } = Typography;

export type Stat = {
  label: string;
  value: string;
  up: boolean;
  change: string;
  icon: LucideIcon;
};

export default function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const { token } = theme.useToken();

  return (
    <Card>
      <Space orientation="vertical" size={4}>
        <Icon size={20} style={{ color: token.colorTextTertiary }} />

        <Text type="secondary" className="text-xs uppercase">
          {stat.label}
        </Text>

        <Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {stat.value}
        </Title>

        <Space size={4}>
          {stat.up ? (
            <ArrowUp
              style={{
                color: token.colorSuccess,
              }}
            />
          ) : (
            <ArrowDown
              style={{
                color: token.colorError,
              }}
            />
          )}

          <Text
            style={{
              color: stat.up ? token.colorSuccess : token.colorError,
              fontSize: 12,
            }}
          >
            {stat.change}
          </Text>
        </Space>

        <Text type="secondary" className="text-xs">
          from last month
        </Text>
      </Space>
    </Card>
  );
}
