import { Card, Row, Tag, Typography, theme } from "antd";

const { Text } = Typography;

export default function TenantInfoCard({ tenant }: any) {
  const { token } = theme.useToken();

  return (
    <Card title="Tenant Info">
      {[
        ["Business", tenant.business],
        ["Owner", tenant.owner],
        ["Email", tenant.email],
        ["Package", tenant.package],
        ["Created", tenant.created],
      ].map(([k, v]) => (
        <Row key={k} justify="space-between" style={{ marginBottom: 10 }}>
          <Text type="secondary">{k}</Text>
          <Text strong>{v}</Text>
        </Row>
      ))}

      <Row justify="space-between">
        <Text type="secondary">Status</Text>
        <Tag
          style={{
            background:
              tenant.status === "Active"
                ? token.colorSuccess
                : token.colorError,
            color: token.colorWhite,
          }}
        >
          {tenant.status}
        </Tag>
      </Row>
    </Card>
  );
}
