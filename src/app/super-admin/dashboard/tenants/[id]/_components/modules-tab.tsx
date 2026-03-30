import { Card, Row, Switch, Typography, theme } from "antd";

const { Text } = Typography;

export default function ModulesTab({ modules, toggleModule }: any) {
  const { token } = theme.useToken();

  return (
    <Card title="Module Access">
      {modules.map((m: any) => (
        <Row
          key={m.id}
          justify="space-between"
          align="middle"
          style={{
            marginBottom: 12,
            border: `2px solid ${token.colorBorder}`,
            padding: 8,
            borderRadius: 8,
          }}
        >
          <div>
            <Text strong>{m.name}</Text>
            <br />
            <Text type="secondary">{m.description}</Text>
          </div>

          <Switch checked={m.enabled} onChange={() => toggleModule(m.id)} />
        </Row>
      ))}
    </Card>
  );
}
