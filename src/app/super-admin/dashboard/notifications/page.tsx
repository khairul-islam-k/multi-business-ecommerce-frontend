"use client";

import { useState } from "react";
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Select,
  Badge,
  Tooltip,
  Button,
  Card,
  message,
  Modal,
  Space,
  Typography,
} from "antd";

import PageHeader from "@/components/shared/page-header";

const { Option } = Select;
const { Text, Paragraph } = Typography;

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean;
  created: string;
};

export default function NotificationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "System",
      title: "Database backup completed",
      message:
        "The scheduled nightly backup for the primary database completed successfully.",
      channel: "System",
      isRead: false,
      created: "2024-03-12 14:30",
    },
    {
      id: "2",
      type: "Alert",
      title: "High CPU usage on tenant-db-03",
      message:
        "CPU usage exceeded 90% for more than 5 minutes on tenant-db-03.",
      channel: "Email",
      isRead: false,
      created: "2024-03-12 13:45",
    },
    {
      id: "3",
      type: "Billing",
      title: "Invoice #INV-2024-0892 payment failed",
      message:
        "Payment attempt for invoice #INV-2024-0892 failed due to insufficient funds.",
      channel: "Email",
      isRead: true,
      created: "2024-03-12 12:00",
    },
    {
      id: "4",
      type: "System",
      title: "SSL certificate renewal - 7 days",
      message:
        "The SSL certificate for api.yourdomain.com will expire in 7 days.",
      channel: "System",
      isRead: false,
      created: "2024-03-11 09:00",
    },
    {
      id: "5",
      type: "Tenant",
      title: "New tenant signup: LogiTrack",
      message:
        "A new tenant 'LogiTrack' has successfully registered on the platform.",
      channel: "Email",
      isRead: false,
      created: "2024-03-10 16:20",
    },
  ]);

  const filtered = notifications.filter((n) => {
    const matchSearch =
      !search || n.title.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ||
      (filter === "unread" && !n.isRead) ||
      n.channel.toLowerCase() === filter;

    return matchSearch && matchFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    message.success("Notification marked as read");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    message.success("All notifications marked as read");
  };

  const openView = (n: Notification) => {
    setSelected(n);
    setOpen(true);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Badge count={type} color="blue" />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, n: Notification) =>
        n.isRead ? (
          <Badge status="default" text="Read" />
        ) : (
          <Badge status="processing" text="Unread" />
        ),
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      render: (text: string) => (
        <span className="text-xs text-gray-500">{text}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, n: Notification) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined style={{ fontSize: 18 }} />}
              onClick={() => openView(n)}
            />
          </Tooltip>

          {!n.isRead && (
            <Tooltip title="Mark as read">
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined style={{ fontSize: 18 }} />}
                onClick={() => markAsRead(n.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" />

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Left Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-xs"
            />

            <Select
              value={filter}
              onChange={setFilter}
              className="w-full sm:w-40"
            >
              <Option value="all">All</Option>
              <Option value="unread">Unread</Option>
              <Option value="email">Email</Option>
              <Option value="system">System</Option>
            </Select>
          </div>

          {/* Right Action */}
          <div className="flex justify-start sm:justify-end">
            <Button
              icon={<CheckCircleOutlined />}
              onClick={markAllRead}
              className="w-full sm:w-auto"
            >
              Mark All Read
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={{}}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title={selected?.title}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        {selected && (
          <Space direction="vertical">
            <Text type="secondary">Type: {selected.type}</Text>
            <Text type="secondary">Channel: {selected.channel}</Text>
            <Text type="secondary">Created: {selected.created}</Text>

            <Paragraph>{selected.message}</Paragraph>
          </Space>
        )}
      </Modal>
    </div>
  );
}
