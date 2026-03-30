import { Card, Row, Switch, Typography } from "antd";

const { Text } = Typography;

export default function FeaturesTab({ featureState, toggleFeature }: any) {
  return (
    <>
      {Object.entries(featureState).map(([group, items]: any) => (
        <Card key={group} title={group} style={{ marginBottom: 16 }}>
          {items.map((f: any, i: number) => (
            <Row
              key={f.name}
              justify="space-between"
              align="middle"
              style={{ marginBottom: 12 }}
            >
              <Text>{f.name}</Text>

              <Switch
                checked={f.enabled}
                onChange={() => toggleFeature(group, i)}
              />
            </Row>
          ))}
        </Card>
      ))}
    </>
  );
}
