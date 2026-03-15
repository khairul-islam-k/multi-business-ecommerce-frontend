"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Tabs,
  Switch,
  Progress,
  Table,
  Tag,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  mockTenants,
  mockModules,
  mockBillingHistory,
  mockSystemLogs,
} from "@/components/demoData/mockData";
import PageHeader from "@/components/shared/page-header";

const { Title, Text } = Typography;

const usageData = [
  { name: "Products", used: 742, limit: 1000 },
  { name: "Orders/mo", used: 1890, limit: 5000 },
  { name: "Storage (GB)", used: 4.2, limit: 10 },
  { name: "API Calls", used: 48200, limit: 100000 },
  { name: "SMS Credits", used: 320, limit: 500 },
];

const apiUsageByDay = [
  { day: "Mon", calls: 7200 },
  { day: "Tue", calls: 8100 },
  { day: "Wed", calls: 6800 },
  { day: "Thu", calls: 9200 },
  { day: "Fri", calls: 7600 },
  { day: "Sat", calls: 4200 },
  { day: "Sun", calls: 3100 },
];

const features: Record<string, { name: string; enabled: boolean }[]> = {
  Orders: [
    { name: "Allow returns", enabled: true },
    { name: "Allow partial payment", enabled: true },
    { name: "Allow COD", enabled: false },
  ],
  "Website Builder": [
    { name: "Enable AI site generation", enabled: false },
    { name: "Enable custom domain", enabled: true },
  ],
};

export default function TenantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [msg, contextHolder] = message.useMessage();

  const tenant = mockTenants.find((t) => t.id === params.id) || mockTenants[0];

  const [modules, setModules] = useState(
    mockModules.map((m) => ({ ...m, enabled: Math.random() > 0.3 })),
  );

  const [featureState, setFeatureState] = useState(features);

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id
          ? (() => {
              msg.success(`${m.name} ${m.enabled ? "disabled" : "enabled"}`);
              return { ...m, enabled: !m.enabled };
            })()
          : m,
      ),
    );
  };

  const toggleFeature = (group: string, index: number) => {
    setFeatureState((prev) => {
      const updated = { ...prev };
      updated[group][index].enabled = !updated[group][index].enabled;

      msg.success(
        `${updated[group][index].name} ${
          updated[group][index].enabled ? "enabled" : "disabled"
        }`,
      );

      return { ...updated };
    });
  };

  return (
    <>
      {contextHolder}

      <PageHeader title={tenant.business}>
        <Button danger> Suspend </Button>
      </PageHeader>

      <Row gutter={[24, 24]}>
        {/* Tenant Info */}
        <Col xs={24} md={8}>
          <Card title="Tenant Info">
            {[
              ["Business", tenant.business],
              ["Owner", tenant.owner],
              ["Email", tenant.email],
              ["Package", tenant.package],
              ["Created", tenant.created],
            ].map(([k, v]) => (
              <Row key={k} justify="space-between">
                <Text type="secondary">{k}</Text>
                <Text strong>{v}</Text>
              </Row>
            ))}

            <Row justify="space-between" style={{ marginTop: 8 }}>
              <Text type="secondary">Status</Text>
              <Tag color={tenant.status === "Active" ? "green" : "red"}>
                {tenant.status}
              </Tag>
            </Row>
          </Card>
        </Col>

        {/* Tabs */}
        <Col xs={24} md={16}>
          <Tabs
            items={[
              {
                key: "overview",
                label: "Overview",
                children: (
                  <Row gutter={[16, 16]}>
                    {usageData.slice(0, 4).map((u) => (
                      <Col span={12} key={u.name}>
                        <Card>
                          <Text type="secondary">{u.name}</Text>
                          <Title level={4}>
                            {u.used} / {u.limit}
                          </Title>
                          <Progress
                            percent={(u.used / u.limit) * 100}
                            showInfo={false}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              },
              {
                key: "usage",
                label: "Usage",
                children: (
                  <>
                    <Row gutter={[16, 16]}>
                      {usageData.map((u) => (
                        <Col span={12} key={u.name}>
                          <Card>
                            <Text>{u.name}</Text>
                            <Progress percent={(u.used / u.limit) * 100} />
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    <Card
                      title="API Calls (Last 7 Days)"
                      style={{ marginTop: 16 }}
                    >
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={apiUsageByDay}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="calls" fill="#1677ff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </>
                ),
              },
              {
                key: "billing",
                label: "Billing",
                children: (
                  <Table
                    rowKey="id"
                    dataSource={mockBillingHistory}
                    columns={[
                      { title: "Invoice", dataIndex: "id" },
                      { title: "Amount", dataIndex: "amount" },
                      { title: "Tax", dataIndex: "tax" },
                      { title: "Total", dataIndex: "total" },
                      {
                        title: "Status",
                        dataIndex: "status",
                        render: (s) => (
                          <Tag color={s === "Paid" ? "green" : "red"}>{s}</Tag>
                        ),
                      },
                      { title: "Paid Date", dataIndex: "paidDate" },
                    ]}
                    pagination={false}
                  />
                ),
              },
              {
                key: "modules",
                label: "Modules",
                children: (
                  <Card>
                    {modules.map((m) => (
                      <Row
                        key={m.id}
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 12 }}
                      >
                        <div>
                          <Text strong>{m.name}</Text>
                          <br />
                          <Text type="secondary">{m.description}</Text>
                        </div>
                        <Switch
                          checked={m.enabled}
                          onChange={() => toggleModule(m.id)}
                        />
                      </Row>
                    ))}
                  </Card>
                ),
              },
              {
                key: "features",
                label: "Features",
                children: Object.entries(featureState).map(([group, items]) => (
                  <Card key={group} title={group} style={{ marginBottom: 16 }}>
                    {items.map((f, i) => (
                      <Row key={f.name} justify="space-between" align="middle">
                        <Text>{f.name}</Text>
                        <Switch
                          checked={f.enabled}
                          onChange={() => toggleFeature(group, i)}
                        />
                      </Row>
                    ))}
                  </Card>
                )),
              },
              {
                key: "logs",
                label: "Logs",
                children: (
                  <Table
                    rowKey="id"
                    dataSource={mockSystemLogs.slice(0, 5)}
                    columns={[
                      {
                        title: "Level",
                        dataIndex: "level",
                        render: (l) => (
                          <Tag
                            color={
                              l === "error"
                                ? "red"
                                : l === "warning"
                                  ? "orange"
                                  : "blue"
                            }
                          >
                            {l}
                          </Tag>
                        ),
                      },
                      { title: "Service", dataIndex: "service" },
                      { title: "Message", dataIndex: "message" },
                      { title: "Time", dataIndex: "timestamp" },
                    ]}
                    pagination={false}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
