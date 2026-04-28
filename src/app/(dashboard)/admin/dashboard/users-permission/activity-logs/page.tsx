"use client";

import { Table, Typography, Popconfirm, Space, Input, Grid, Card, Tag } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";


// Your activity data
const activityLogsData = [
  {
    id: 1,
    userName: "John Doe",
    action: "Login",
    target: "User Account",
    details: "User logged in successfully",
    time: "2025-03-28 09:12 AM",
  },
  {
    id: 2,
    userName: "John Doe",
    action: "Create User",
    target: "User: Ayesha Rahman",
    details: "New user account created with Manager role",
    time: "2025-03-28 10:05 AM",
  },
  {
    id: 3,
    userName: "Ayesha Rahman",
    action: "Update Permission",
    target: "Role: Sales Associate",
    details: "Granted access to View Orders and Edit Orders",
    time: "2025-03-27 04:30 PM",
  },
  {
    id: 4,
    userName: "Ayesha Rahman",
    action: "Assign Role",
    target: "User: Tanvir Hasan",
    details: "Assigned role Sales Associate",
    time: "2025-03-27 02:18 PM",
  },
  {
    id: 5,
    userName: "John Doe",
    action: "Delete User",
    target: "User: Rahim Uddin",
    details: "User account removed by Admin",
    time: "2025-03-26 11:45 AM",
  },
  {
    id: 6,
    userName: "Tanvir Hasan",
    action: "Logout",
    target: "User Account",
    details: "User logged out",
    time: "2025-03-26 06:55 PM",
  },
  {
    id: 7,
    userName: "Rahim Uddin",
    action: "Failed Login",
    target: "User Account",
    details: "Incorrect password attempt",
    time: "2025-03-26 08:22 AM",
  },
];

const columns = [
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (action: string) => <Tag>{action}</Tag>
    },
    {
        title: "User Name",
        dataIndex: "userName",
        key: "userName",
    },
    {
        title: "target",
        dataIndex: "target",
        key: "target",
    },
    {
        title: "Time",
        dataIndex: "time",
        key: "time",
    },
    {
        title: "details",
        dataIndex: "details",
        key: "details",
    },
];

const ActivityLogs = () => {
    const screens = Grid.useBreakpoint();
    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Activity Logs' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Audit trail of all administrative actions.</p>

            {/* Search field */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    style={{
                        width: screens.lg ? "330px" : "100%"
                    }}
                    prefix={<SearchOutlined />}
                    placeholder="Search packages..."
                />
            </Space>


            <Card style={{ overflow: 'auto' }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={activityLogsData}
                    bordered
                    pagination={false}
                />
            </Card>

        </div>
    );
};

export default ActivityLogs;