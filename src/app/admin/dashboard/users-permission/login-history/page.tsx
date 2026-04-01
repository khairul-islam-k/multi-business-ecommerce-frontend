"use client";

import { Table, Typography, Popconfirm, Space, Input, Grid, Card, Tag } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";


// Your assignment data
const loginHistoryData = [
    {
        id: 1,
        status: "Success",
        user: "John Doe",
        ipAddress: "192.168.1.12",
        device: "Desktop",
        browser: "Chrome",
        time: "2025-03-28 09:15 AM",
    },
    {
        id: 2,
        status: "Failed",
        user: "Ayesha Rahman",
        ipAddress: "103.94.135.21",
        device: "Mobile",
        browser: "Safari",
        time: "2025-03-28 10:42 AM",
    },
    {
        id: 3,
        status: "Success",
        user: "Tanvir Hasan",
        ipAddress: "45.120.77.98",
        device: "Laptop",
        browser: "Firefox",
        time: "2025-03-27 08:30 PM",
    },
    {
        id: 4,
        status: "Success",
        user: "Nusrat Jahan",
        ipAddress: "172.16.5.44",
        device: "Tablet",
        browser: "Edge",
        time: "2025-03-27 03:05 PM",
    },
    {
        id: 5,
        status: "Failed",
        user: "Rahim Uddin",
        ipAddress: "203.76.98.110",
        device: "Mobile",
        browser: "Chrome",
        time: "2025-03-26 11:18 AM",
    },
    {
        id: 6,
        status: "Success",
        user: "Sabbir Ahmed",
        ipAddress: "10.0.0.8",
        device: "Desktop",
        browser: "Chrome",
        time: "2025-03-26 06:50 PM",
    },
];

const columns = [
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => <Tag
                            style={{ background: status === "Success" ? "#21c45d" : "red", color: 'white' }}
                        >{status}</Tag>
    },
    {
        title: "User",
        dataIndex: "user",
        key: "user",
    },
    {
        title: "Ip Address",
        dataIndex: "ipAddress",
        key: "ipAddress",
    },
    {
        title: "Time",
        dataIndex: "time",
        key: "time",
    },
    {
        title: "Device",
        dataIndex: "device",
        key: "device",
    },
    {
        title: "browser",
        key: "browser",
        dataIndex: "browser"
        
    },
];

const LoginHistory = () => {
    const screens = Grid.useBreakpoint();
    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Login History' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Track all authentication attempts across the system.</p>

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
                    dataSource={loginHistoryData}
                    bordered
                    pagination={false}
                />
            </Card>

        </div>
    );
};

export default LoginHistory;