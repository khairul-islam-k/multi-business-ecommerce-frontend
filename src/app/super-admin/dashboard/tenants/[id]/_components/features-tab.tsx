"use client";

import { Card, Row, Switch, Typography, Empty } from "antd";

const { Text } = Typography;

type FeatureItem = {
  id: number;
  name: string;
  enabled: boolean;
};

type FeatureGroup = {
  group: string;
  items: FeatureItem[];
};

export default function FeaturesTab({
  features = [],
  toggleFeature,
}: {
  features: FeatureGroup[];
  toggleFeature?: (featureId: number) => void;
}) {
  if (!features.length) {
    return <Empty description="No features found" />;
  }

  return (
    <>
      {features.map((group) => (
        <Card
          key={group.group}
          title={group.group}
          style={{ marginBottom: 16 }}
        >
          {group.items.map((f) => (
            <Row
              key={f.id}
              justify="space-between"
              align="middle"
              style={{ marginBottom: 12 }}
            >
              <Text>{f.name}</Text>

              <Switch
                checked={f.enabled}
                onChange={() => toggleFeature?.(f.id)}
              />
            </Row>
          ))}
        </Card>
      ))}
    </>
  );
}
