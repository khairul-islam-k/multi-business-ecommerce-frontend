import { Row, Col, Card, Progress, Typography } from "antd";
import { mockUsageData } from "../data";

const { Text, Title } = Typography;

export default function OverviewTab() {
  return (
    <Row gutter={[16, 16]}>
      {mockUsageData.slice(0, 4).map((u) => (
        <Col xs={24} md={12} key={u.name}>
          <Card size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>
              {u.name}
            </Text>

            <Title level={5} style={{ margin: "4px 0" }}>
              {u.used} / {u.limit}
            </Title>

            <Progress
              percent={(u.used / u.limit) * 100}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
