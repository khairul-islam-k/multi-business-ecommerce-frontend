"use client";

import { useState } from "react";
import {
  Input,
  Select,
  Space,
  Table,
  Typography,
  Badge,
  Button,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ApiOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export type Log = {
  id: string;
  level: "error" | "warning" | "info";
  service: string;
  message: string;
  timestamp: string;
};

export default function SystemLogsTable({ logs }: { logs: Log[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Log | null>(null);
  const [open, setOpen] = useState(false);

  const levelConfig = {
    error: {
      color: "error",
      icon: <CloseCircleOutlined />,
      label: "Error",
    },
    warning: {
      color: "warning",
      icon: <WarningOutlined />,
      label: "Warning",
    },
    info: {
      color: "processing",
      icon: <InfoCircleOutlined />,
      label: "Info",
    },
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.service.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" ? true : log.level === filter;

    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      title: (
        <Space>
          <InfoCircleOutlined />
          Level
        </Space>
      ),
      dataIndex: "level",
      key: "level",
      render: (level: keyof typeof levelConfig) => {
        const config = levelConfig[level];

        return (
          <Badge
            status={config.color as any}
            text={
              <Space>
                {config.icon}
                <Text>{config.label}</Text>
              </Space>
            }
          />
        );
      },
    },
    {
      title: (
        <Space>
          <ApiOutlined />
          Service
        </Space>
      ),
      dataIndex: "service",
      key: "service",
      render: (service: string) => <Text code>{service}</Text>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined />
          Timestamp
        </Space>
      ),
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Log) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelected(record);
            setOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Select value={filter} onChange={setFilter} className="w-40">
          <option value="all">All</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </Select>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={selected?.service}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        {selected && (
          <Space direction="vertical">
            <Text type="secondary">Service: {selected.service}</Text>
            <Text type="secondary">Created: {selected.timestamp}</Text>
            <Paragraph>{selected.message}</Paragraph>
          </Space>
        )}
      </Modal>
    </>
  );
}
