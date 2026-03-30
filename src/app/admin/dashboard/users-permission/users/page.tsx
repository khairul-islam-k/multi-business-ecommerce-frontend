"use client"
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { EyeOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Grid, Input, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface TUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    created_by: string;
}

const Users = () => {
    const { useBreakpoint } = Grid;
    const screen = useBreakpoint();
    const router = useRouter();
    const users = [
        {
            "id": 1,
            "name": "Rahim Uddin",
            "email": "rahim.uddin@example.com",
            "phone": "+8801712345678",
            "status": "active",
            "created_by": "Admin"
        },
        {
            "id": 2,
            "name": "Karim Hasan",
            "email": "karim.hasan@example.com",
            "phone": "+8801812345679",
            "status": "inactive",
            "created_by": "Admin"
        },
        {
            "id": 3,
            "name": "Nusrat Jahan",
            "email": "nusrat.jahan@example.com",
            "phone": "+8801912345680",
            "status": "active",
            "created_by": "Super Admin"
        },
        {
            "id": 4,
            "name": "Tanvir Ahmed",
            "email": "tanvir.ahmed@example.com",
            "phone": "+8801612345681",
            "status": "pending",
            "created_by": "Manager"
        },
        {
            "id": 5,
            "name": "Ayesha Rahman",
            "email": "ayesha.rahman@example.com",
            "phone": "+8801512345682",
            "status": "active",
            "created_by": "Admin"
        }
    ]

    const [filteredUsers, setFilteredUsers] = useState<TUser[]>(users);

    const handleSearch = (data: string) => {

        const result = users.filter(singleData => singleData.name.toLocaleLowerCase().includes(data.toLocaleLowerCase()));
        setFilteredUsers(result);
    }

    const usersColumns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (t: string) => <strong>{t}</strong>,
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "phone",
            dataIndex: "phone",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string) => (
                <Tag
                    style={{ background: s === "active" ? "#21c45d" : "red", color: 'white' }}
                >{s}</Tag>
            ),
        },
        {
            title: "Created By",
            dataIndex: "created_by",
        },
        {
            title: "",
            render: (_: any, record: any) => (
                <Flex>
                    <Link href={`/admin/dashboard/users-permission/users/details/${record.id}`}>
                        <Button type="text" icon={<EyeOutlined />} />
                    </Link>

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "edit",
                                    label: "Edit",
                                    onClick: () => router.push(`/admin/dashboard/users-permission/users/edit-user/${record.id}`),
                                },
                                {
                                    key: "delete",
                                    danger: true,
                                    label: "Delete",
                                },
                            ],
                        }}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Flex>
            ),
        },
    ];


    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Users list' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Card>
                <Flex
                    justify="space-between"
                    wrap="wrap"
                >
                    <Space style={{ marginBottom: 16 }}>
                        <Input
                            style={{
                                width: screen.lg ? "330px" : "100%"
                            }}
                            prefix={<SearchOutlined />}
                            placeholder="Search packages..."
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Space>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/admin/dashboard/users-permission/users/create-user')}
                    >
                        Create User
                    </Button>
                </Flex>

                <Table
                    rowKey="id"
                    columns={usersColumns}
                    dataSource={filteredUsers}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                />
            </Card>
        </div>
    );
};

export default Users;