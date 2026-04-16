"use client";

import { Card, Row, Tag, Typography, theme } from "antd";

const { Text } = Typography;

export default function TenantInfoCard({ tenant }: { tenant: any }) {
  const { token } = theme.useToken();

  const rows = [
    ["Business", tenant?.business_name],
    ["Owner", tenant?.owner?.name],
    ["Email", tenant?.email],
    ["Phone", tenant?.phone],
    ["Currency", tenant?.currency],
    ["Timezone", tenant?.timezone],
    [
      "Created",
      tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "—",
    ],
  ];

  return (
    <Card title="Tenant Info">
      {rows.map(([k, v]) => (
        <Row key={k} justify="space-between" style={{ marginBottom: 10 }}>
          <Text type="secondary">{k}</Text>
          <Text strong>{v || "—"}</Text>
        </Row>
      ))}

      <Row justify="space-between">
        <Text type="secondary">Status</Text>
        <Tag
          style={{
            background:
              tenant?.status === "Active"
                ? token.colorSuccess
                : token.colorError,
            color: token.colorWhite,
          }}
        >
          {tenant?.status || "Unknown"}
        </Tag>
      </Row>
    </Card>
  );
}
