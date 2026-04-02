"use client";

import { Col, DatePicker, Row, Table, Typography, Card } from "antd";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockProfitLoss } from "./data";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function ProfitLossPage() {
  const [dates, setDates] = useState<any>(null);

  const { tableData, revenue, expenses, profit } = useMemo(() => {
    let filtered = mockProfitLoss;

    if (dates) {
      const [start, end] = dates;

      console.log("DATE: ", dates);

      filtered = mockProfitLoss.filter((t) => {
        const d = dayjs(t.date);
        return (
          d.isAfter(start.subtract(1, "day")) && d.isBefore(end.add(1, "day"))
        );
      });
    }

    console.log("FILTERED: ", filtered);

    const revenue = filtered
      .filter((t) => t.type === "revenue")
      .reduce((s, t) => s + t.amount, 0);

    const expenses = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const profit = revenue - expenses;

    const grouped: Record<string, number> = {};

    filtered.forEach((t) => {
      const key = `${t.type}:${t.category}:${t.subCategory}`;
      grouped[key] = (grouped[key] || 0) + t.amount;
    });

    const tableData = Object.entries(grouped).map(([key, value], i) => {
      const [type, category, subCategory] = key.split(":");

      return {
        key: i,
        type,
        category,
        subCategory,
        amount: value,
      };
    });

    return { tableData, revenue, expenses, profit };
  }, [dates]);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      render: (val: string) => (
        <Text type={val === "revenue" ? "success" : "danger"}>
          {val.toUpperCase()}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-mono">${val.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Profit & Loss" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <RangePicker onChange={(e) => setDates(e)} />
        </Col>

        {/* Summary */}
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={8}>
              <Card>
                <Text type="secondary">Revenue</Text>
                <div className="font-mono text-lg text-green-600">
                  ${revenue.toLocaleString()}
                </div>
              </Card>
            </Col>

            <Col xs={12} md={8}>
              <Card>
                <Text type="secondary">Expenses</Text>
                <div className="font-mono text-lg text-red-500">
                  ${expenses.toLocaleString()}
                </div>
              </Card>
            </Col>

            <Col xs={12} md={8}>
              <Card>
                <Text type="secondary">Net Profit</Text>
                <div className="font-mono text-lg">
                  ${profit.toLocaleString()}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Table */}
        <Col span={24}>
          <Card style={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              locale={{ emptyText: "No data for selected range." }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
