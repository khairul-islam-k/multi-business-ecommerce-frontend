"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { GlobalOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Space, Table, Tag, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React from 'react';

type WebsiteRow = {
    id: number;
    Website: string;
    Domain: string;
    Template: string;
    Status: string;
    Published: string;
};

const websitesData = [
    {
        id: 1,
        Website: "Main Store",
        Domain: "mainstore.com",
        Template: "Template #1",
        Status: "Published",
        Published: "30/1/26",
    },
    {
        id: 2,
        Website: "Fashion Hub",
        Domain: "fashionhub.pk",
        Template: "Template #2",
        Status: "Draft",
        Published: "—",
    },
    {
        id: 3,
        Website: "Tech World",
        Domain: "techworld.io",
        Template: "Template #3",
        Status: "Published",
        Published: "15/2/26",
    },
    {
        id: 4,
        Website: "Home Essentials",
        Domain: "homeessentials.store",
        Template: "Template #1",
        Status: "Unpublished",
        Published: "—",
    },
];

const WebSiteList = () => {
    const { token } = theme.useToken();
    const columns: ColumnsType<WebsiteRow> = [
        {
            title: "Website",
            dataIndex: "Website",
            key: "Website",
            render: (Website: string, record: WebsiteRow) => {
                return <Flex style={{
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        background: token.colorBgContainerDisabled,
                        height: '30px',
                        width: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        color: token.colorPrimary
                    }}>
                        <GlobalOutlined />
                    </div>

                    <div>
                        <h3 style={{ marginBottom: 0! }}>{Website}</h3>
                        <p>{record.Domain}</p>
                    </div>
                </Flex>
            }
        },
        {
            title: "Domain",
            dataIndex: "Domain",
            key: "Domain",
        },
        {
            title: "Template",
            dataIndex: "Template",
            key: "Template",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (status: string) => {
                const color =
                    status === "Published"
                        ? "green"
                        : status === "Draft"
                            ? "orange"
                            : "red";

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Published",
            dataIndex: "Published",
            key: "Published",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_: string, record: WebsiteRow) => (
                <Space>
                    <Link href={`/admin/dashboard/website-builder/websites/details/${record.id}`}>
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => console.log("Settings:", record)}
                    />
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Websites' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Card>
                <div style={{
                    textAlign: 'right',
                    marginBottom: '24px'
                }}>
                    <Link href='/admin/dashboard/website-builder/websites/create-website'>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary">Create website</Button>
                    </Link>
                </div>

                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={websitesData}
                        pagination={false}
                    />
                </div>
            </Card>
        </div>
    );
};

export default WebSiteList;