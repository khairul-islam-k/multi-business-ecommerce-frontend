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
  theme,
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

  const { token } = theme.useToken();

  const toggleFeature = (group: string, index: number) => {
    setFeatureState((prev) => {
      const updated = { ...prev };
      updated[group][index].enabled = !updated[group][index].enabled;

      msg.success(
        `${updated[group][index].name} ${updated[group][index].enabled ? "enabled" : "disabled"
        }`,
      );

      return { ...updated };
    });
  };

  const companyData = [
  {
    key: "1",
    company: "Main Store",
    websites: 1,
    users: 5,
  },
  {
    key: "2",
    company: "Warehouse Ops",
    websites: 2,
    users: 10,
  },
  {
    key: "3",
    company: "Online Division",
    websites: 3,
    users: 15,
  },
];

const companyColumn = [
  {
    title: "COMPANY",
    dataIndex: "company",
    key: "company",
    render: (text: string) => <strong>{text}</strong>,
  },
  {
    title: "WEBSITES",
    dataIndex: "websites",
    key: "websites",
  },
  {
    title: "USERS",
    dataIndex: "users",
    key: "users",
  },
];

  return (
    <>
      {contextHolder}

      <div style={{ marginBottom: '10px' }}>
        <PageHeader title={tenant.business}>
          <Button danger> Suspend </Button>
        </PageHeader>
      </div>

      <Row gutter={[24, 24]}>
        {/* Tenant Info */}
        <Col xs={24} md={8}>
          <Card style={{ height: '100%' }} title="Tenant Info">
            {[
              ["Business", tenant.business],
              ["Owner", tenant.owner],
              ["Email", tenant.email],
              ["Package", tenant.package],
              ["Created", tenant.created],
            ].map(([k, v]) => (
              <Row key={k} style={{ marginBottom: '10px' }} justify="space-between">
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
                      <Col xs={24} sm={24} md={12} key={u.name}>
                        <Card size="small" bodyStyle={{ padding: 12 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {u.name}
                          </Text>

                          <Title level={5} style={{ margin: "4px 0" }}>
                            {u.used} / {u.limit}
                          </Title>

                          <Progress
                            percent={(u.used / u.limit) * 100}
                            showInfo={false}
                            strokeWidth={6}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              },
              {
                key: "companies",
                label: "companies",
                children: (
                  <div style={{ overflowX: 'auto', overflowY: 'hidden', background: token.colorBgBase }}>
                    <Table
                      rowKey="id"
                      dataSource={companyData}
                      columns={companyColumn}
                      pagination={false}
                    />
                  </div>
                ),
              },
              {
                key: "usage",
                label: "Usage",
                children: (
                  <>
                    <Row gutter={[16, 16]}>
                      {usageData.map((u) => (
                        <Col xs={24} sm={24} md={12} key={u.name}>
                          <Card>
                            <Text>{u.name}</Text>

                            <Progress
                              percent={(u.used / u.limit) * 100}
                              showInfo={false}
                              strokeWidth={6}
                            />
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
                  <div style={{ overflowX: 'auto', overflowY: 'hidden', background: token.colorBgBase }}>
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
                            <Tag
                              style={{ background: s === "Paid" ? "#21c45d" : "#ef4444", color: 'white' }}
                            >{s}</Tag>
                          ),
                        },
                        { title: "Paid Date", dataIndex: "paidDate" },
                      ]}
                      pagination={false}
                    />
                  </div>
                ),
              },
              {
                key: "modules",
                label: "Modules",
                children: (
                  <Card>
                    <h3 style={{ fontSize: '20px', fontWeight: '700' }}
                    >Module Access</h3>
                    {modules.map((m) => (
                      <Row
                        key={m.id}
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 12, border: `2px solid ${token.colorBorder}`, padding: '8px', borderRadius: '8px' }}
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
                      <Row
                        style={{ marginBottom: '12px' }}
                        key={f.name} justify="space-between" align="middle">
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
                  <div style={{ overflowX: 'auto', overflowY: 'hidden', background: token.colorBgBase }}>
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
                  </div>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
