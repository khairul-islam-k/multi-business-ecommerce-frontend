"use client";

import { useMemo, useState } from "react";
import { Card, Row, Col, Select, DatePicker, Space } from "antd";
import { BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { mockExpenses } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { RangePicker } = DatePicker;

export default function ExpenseReportsPage() {
  const [filter, setFilter] = useState("all");

  // ✅ Monthly Aggregation
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};

    mockExpenses.forEach((exp) => {
      const month = new Date(exp.expense_date).toLocaleString("default", {
        month: "short",
      });

      map[month] = (map[month] || 0) + exp.amount;
    });

    return Object.keys(map).map((key) => ({
      month: key,
      total: map[key],
    }));
  }, []);

  // ✅ Category Aggregation
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};

    mockExpenses.forEach((exp) => {
      map[exp.category_name] = (map[exp.category_name] || 0) + exp.amount;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, []);

  const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f"];

  return (
    <div className="space-y-6">
      <PageHeader title="Expense Reports" breadcrumb={adminBreadcrumb} />

      {/* Filters */}
      <div>
        <Card>
          <Space wrap>
            <RangePicker />
            <Select
              value={filter}
              onChange={setFilter}
              style={{ width: 200 }}
              options={[
                { label: "All Categories", value: "all" },
                { label: "Office Supplies", value: "Office Supplies" },
                { label: "Travel", value: "Travel" },
              ]}
            />
          </Space>
        </Card>
      </div>

      <Row gutter={[16, 16]}>
        {/* Monthly Report */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <BarChartOutlined /> Monthly Expense Report – 186
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Report */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <PieChartOutlined /> Category-wise Expense Report – 187
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
