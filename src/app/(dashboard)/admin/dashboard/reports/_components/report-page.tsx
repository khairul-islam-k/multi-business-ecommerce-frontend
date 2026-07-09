"use client";

import {
  Download,
  Filter
} from "lucide-react";


import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  LineChart,
  BarChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Bar,
} from "recharts";

import StatCard, { Stat } from "@/components/shared/stat-card";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ReportPageProps {
  title: string;
  description: string;
  stats: Stat[];
  chartData: { name: string; value: number; value2?: number }[];
  chartType?: "bar" | "line";
  tableHeaders: string[];
  tableRows: string[][];
}

export default function ReportPage({
  title,
  description,
  stats,
  chartData,
  chartType = "bar",
  tableHeaders,
  tableRows,
}: ReportPageProps) {
  // Convert table data → AntD format
  const columns: ColumnsType<any> = tableHeaders.map((header, i) => ({
    title: header,
    dataIndex: `col${i}`,
    key: `col${i}`,
  }));

  const dataSource = tableRows.map((row, i) => {
    const obj: any = { key: i };
    row.forEach((cell, j) => {
      obj[`col${j}`] = cell;
    });
    return obj;
  });

  // Chart configs
  const lineConfig = {
    data: chartData,
    xField: "name",
    yField: "value",
    smooth: true,
  };

  const barConfig = {
    data: chartData,
    xField: "name",
    yField: "value",
  };

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            <Text type="secondary">{description}</Text>
          </Col>

          <Col>
            <Space>
              <RangePicker />
              <Button icon={<Filter />}>Filter</Button>
              <Button type="primary" icon={<Download />}>
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Chart */}
      <Card title="Trend" style={{ marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--dashboard-primary-color)"
                strokeWidth={2}
              />

              {chartData[0]?.value2 !== undefined && (
                <Line
                  type="monotone"
                  dataKey="value2"
                  stroke="var(--dashboard-success-color)"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="value" fill="var(--dashboard-primary-color)" />

              {chartData[0]?.value2 !== undefined && (
                <Bar dataKey="value2" fill="var(--dashboard-success-color)" />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </Card>
    </div>
  );
}
