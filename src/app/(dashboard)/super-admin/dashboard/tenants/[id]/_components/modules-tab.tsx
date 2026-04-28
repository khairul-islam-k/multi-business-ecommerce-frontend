"use client";

import { Card, Row, Switch, Typography, theme, Empty } from "antd";

const { Text } = Typography;

export default function ModulesTab({
  modules = [],
  toggleModule,
}: {
  modules: any[];
  toggleModule?: (id: number) => void;
}) {
  const { token } = theme.useToken();

  if (!modules.length) return <Empty description="No modules found" />;

  return (
    <Card title="Module Access">
      {modules.map((m) => (
        <Row
          key={m.id}
          justify="space-between"
          align="middle"
          style={{
            marginBottom: 12,
            border: `1px solid ${token.colorBorder}`,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <div>
            <Text strong>{m.name}</Text>
            <br />
            <Text type="secondary">{m.description}</Text>
          </div>

          <Switch checked={m.enabled} onChange={() => toggleModule?.(m.id)} />
        </Row>
      ))}
    </Card>
  );
}
