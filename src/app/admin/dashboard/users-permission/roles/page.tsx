"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined, PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Dropdown, Flex, Grid, Input, Row, Space, theme } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const RolesPage = () => {
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();
    const router = useRouter();
    const roles = [
        {
            "id": 1,
            "tenant_id": null,
            "name": "Administrator",
            "slug": "admin",
            "description": "Full access to all system features and settings.",
            "is_system_role": true,
            "created_at": "2026-03-30T10:15:00Z",
            "updated_at": "2026-03-30T12:30:00Z"
        },
        {
            "id": 2,
            "tenant_id": 5,
            "name": "Manager",
            "slug": "manager",
            "description": "Can manage users, orders, and reports but cannot change system settings.",
            "is_system_role": false,
            "created_at": "2026-03-25T09:00:00Z",
            "updated_at": "2026-03-28T15:45:00Z"
        },
        {
            "id": 3,
            "tenant_id": 3,
            "name": "Editor",
            "slug": "editor",
            "description": "Can edit content and manage categories, but cannot access user management.",
            "is_system_role": false,
            "created_at": "2026-03-20T11:20:00Z",
            "updated_at": "2026-03-27T14:10:00Z"
        },
        {
            "id": 4,
            "tenant_id": null,
            "name": "System Auditor",
            "slug": "system-auditor",
            "description": "Read-only access to system logs and reports for auditing purposes.",
            "is_system_role": true,
            "created_at": "2026-03-15T08:30:00Z",
            "updated_at": "2026-03-29T16:00:00Z"
        },
        {
            "id": 5,
            "tenant_id": 7,
            "name": "Support",
            "slug": "support",
            "description": "Can view tickets, manage support requests, and communicate with customers.",
            "is_system_role": false,
            "created_at": "2026-03-18T10:45:00Z",
            "updated_at": "2026-03-28T13:55:00Z"
        }
    ];

    const formattedDate = new Date("2026-03-28T13:55:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const handleSearch = (searchData: string) => {
        console.log('searcha', searchData);
    }

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Roles & Permissions' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>5 roles configured · Manage access levels for your team</p>

            {/* Search field */}
            <Flex
                    justify="space-between"
                    wrap="wrap"
                    style={{marginBottom: '10px'}}
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

            <Row gutter={[16, 16]}>
                {
                    roles.map(data => <Col xs={24} md={12} key={data.id}>
                        <Card>
                            <Flex justify='space-between'>
                                <Flex align='center' style={{ gap: '10px' }}>
                                    <div style={{
                                        background: token.colorBgContainerDisabled,
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '15px'

                                    }}>
                                        <SettingOutlined style={{
                                            fontSize: '24px',
                                        }} />
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '17px' }}>{data.name}</h3>
                                        <p>{data.slug}</p>
                                    </div>
                                </Flex>

                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: "view",
                                                label: <div><EyeOutlined /> view</div>,
                                                onClick: () => router.push(`/admin/dashboard/users-permission/users/edit-user/${data.id}`),
                                            },
                                            {
                                                key: "edit",
                                                label: <div><EditOutlined /> Edit</div>,
                                                onClick: () => router.push(`/admin/dashboard/users-permission/roles/edit/${data.id}`),
                                            },
                                            {
                                                key: "delete",
                                                danger: true,
                                                label: <div><DeleteOutlined /> Edit</div>,
                                    
                                            },
                                        ],
                                    }}
                                >
                                    <Button type="text" icon={<MoreOutlined />} />
                                </Dropdown>

                            </Flex>

                            <p>{data.description}</p>

                            <Flex justify='space-between'>
                                <button style={{
                                    background: data.is_system_role ? 'blue': token.colorTextDisabled,
                                    padding: '2px 8px',
                                    borderRadius: '9px',
                                    color: 'white'
                                }}>{data.is_system_role ? "System": "Custom" }</button>

                                <div>update {formattedDate}</div>
                            </Flex>
                        </Card>
                    </Col>)
                }
            </Row>

        </div>
    );
};

export default RolesPage;