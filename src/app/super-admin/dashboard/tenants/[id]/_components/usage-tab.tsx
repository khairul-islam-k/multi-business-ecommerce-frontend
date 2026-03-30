import { Row, Col, Card, Progress, Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { mockUsageData, mockApiUsageByDay } from "../data";

const { Text } = Typography;

export default function UsageTab() {
  return (
    <>
      <Row gutter={[16, 16]}>
        {mockUsageData.map((u) => (
          <Col xs={24} md={12} key={u.name}>
            <Card>
              <Text>{u.name}</Text>

              <Progress
                percent={(u.used / u.limit) * 100}
                showInfo={false}
                size="small"
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="API Calls (Last 7 Days)" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockApiUsageByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calls" fill="#1677ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
