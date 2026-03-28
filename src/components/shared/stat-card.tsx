import { Card, Space, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

const { Text, Title } = Typography;

export type Stat = {
  label: string;
  value: string;
  up: boolean;
  change: string;
  icon: React.FC<AntdIconProps>;
};

export default function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  return (
    <Card>
      <Space orientation="vertical" size={4}>
        <Icon style={{ fontSize: 20, color: "#8c8c8c" }} />

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
            <ArrowUpOutlined
              style={{
                color: "#52c41a",
              }}
            />
          ) : (
            <ArrowDownOutlined
              style={{
                color: "#ff4d4f",
              }}
            />
          )}

          <Text
            style={{
              color: stat.up ? "#52c41a" : "#ff4d4f",
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
