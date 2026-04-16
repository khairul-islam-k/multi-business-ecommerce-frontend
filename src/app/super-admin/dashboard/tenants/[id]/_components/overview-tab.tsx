"use client";

import { Row, Col, Card, Progress, Typography } from "antd";

const { Text, Title } = Typography;

export default function OverviewTab({ tenant }: { tenant: any }) {
  const usage = tenant?.usage?.slice(0, 4) || [];

  return (
    <Row gutter={[16, 16]}>
      {usage.map((u: any) => {
        const percent = u.limit ? (u.used / u.limit) * 100 : 0;

        return (
          <Col xs={24} md={12} key={u.name}>
            <Card size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>
                {u.name}
              </Text>

              <Title level={5} style={{ margin: "4px 0" }}>
                {u.used} / {u.limit}
              </Title>

              <Progress
                percent={Math.min(percent, 100)}
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
