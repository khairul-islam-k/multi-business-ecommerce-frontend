"use client";

import { Table, Typography, Popconfirm, Flex, Space, Input, Grid, Button, Card } from "antd";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useRouter } from "next/navigation";

const { Title } = Typography;

// Your assignment data
const assignmentData = [
    {
        id: 1,
        user: "John Doe",
        role: "Admin",
        assignedBy: "Super Admin",
        assignedAt: "2025-03-15 10:30 AM",
    },
    {
        id: 2,
        user: "Ayesha Rahman",
        role: "Manager",
        assignedBy: "John Doe",
        assignedAt: "2025-03-16 02:15 PM",
    },
    {
        id: 3,
        user: "Tanvir Hasan",
        role: "Sales Associate",
        assignedBy: "Ayesha Rahman",
        assignedAt: "2025-03-18 11:45 AM",
    },
    {
        id: 4,
        user: "Nusrat Jahan",
        role: "Inventory Clerk",
        assignedBy: "John Doe",
        assignedAt: "2025-03-20 09:10 AM",
    },
    {
        id: 5,
        user: "Rahim Uddin",
        role: "Customer Support",
        assignedBy: "Ayesha Rahman",
        assignedAt: "2025-03-22 04:55 PM",
    },
    {
        id: 6,
        user: "Sabbir Ahmed",
        role: "Viewer",
        assignedBy: "John Doe",
        assignedAt: "2025-03-25 01:20 PM",
    },
];

export default function RoleAssignmentsPage() {
    const handleDelete = (record: any) => {
        console.log("Delete assignment:", record);
    };

    const screens = Grid.useBreakpoint();
    const router = useRouter();

    const columns = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Assigned By",
            dataIndex: "assignedBy",
            key: "assignedBy",
        },
        {
            title: "Assigned At",
            dataIndex: "assignedAt",
            key: "assignedAt",
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Are you sure you want to delete this assignment?"
                    onConfirm={() => handleDelete(record)}
                >
                    <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                </Popconfirm>
            ),
        },
    ];

    const handleSearch = (searchData: string) => {
        console.log('search', searchData);
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Role Assignments' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>5 roles configured · Manage access levels for your team</p>

            {/* Search field */}
            <Flex
                justify="space-between"
                wrap="wrap"
                style={{ marginBottom: '10px' }}
            >
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        style={{
                            width: screens.lg ? "330px" : "100%"
                        }}
                        prefix={<SearchOutlined />}
                        placeholder="Search packages..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/admin/dashboard/users-permission/roles/create')}
                >
                    New Role
                </Button>
            </Flex>

            <Title level={3}>Role Assignments</Title>

            <Card style={{overflow: 'auto'}}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={assignmentData}
                    bordered
                    pagination={false}
                />
            </Card>

        </div>
    );
}