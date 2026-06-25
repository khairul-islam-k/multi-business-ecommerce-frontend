"use client";

import {
  CircleCheck,
  Eye,
  Search
} from "lucide-react";


import { useState } from "react";
import {
  Table,
  Input,
  Select,
  Badge,
  Tooltip,
  Button,
  Card,
  Modal,
  Space,
  Typography,
} from "antd";

import { Notification } from "./type";
import { useSwal } from "@/hooks/use-swal";
import { mockNotifications } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Option } = Select;
const { Text, Paragraph } = Typography;

export default function NotificationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);
  const swal = useSwal();

  const [notifications, setNotifications] = useState(mockNotifications);

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
    swal.success("Notification marked as read");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    swal.success("All notifications marked as read");
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
      render: (n: Notification) =>
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
      render: (n: Notification) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="link"
              size="small"
              icon={<Eye style={{ fontSize: 18 }} />}
              onClick={() => openView(n)}
            />
          </Tooltip>

          {!n.isRead && (
            <Tooltip title="Mark as read">
              <Button
                type="link"
                size="small"
                icon={<CircleCheck style={{ fontSize: 18 }} />}
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
      <PageHeader title="Notifications" breadcrumb={adminBreadcrumb} />

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Left Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <Input
              prefix={<Search />}
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
              icon={<CircleCheck />}
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
