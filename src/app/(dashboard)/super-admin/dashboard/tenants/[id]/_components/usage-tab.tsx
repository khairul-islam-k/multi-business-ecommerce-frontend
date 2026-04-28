"use client";

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

const { Text } = Typography;

type UsageItem = {
  name: string;
  used: number;
  limit: number;
};

export default function UsageTab({ tenant }: { tenant: any }) {
  const usage: UsageItem[] = tenant?.usage || [];
  const apiUsage = tenant?.api_usage_last_7_days || [];

  return (
    <>
      <Row gutter={[16, 16]}>
        {usage.map((u) => {
          const percent = u.limit ? (u.used / u.limit) * 100 : 0;

          return (
            <Col xs={24} md={12} key={u.name}>
              <Card>
                <Text>{u.name}</Text>

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

      <Card title="API Calls (Last 7 Days)" style={{ marginTop: 16 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={apiUsage}>
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
