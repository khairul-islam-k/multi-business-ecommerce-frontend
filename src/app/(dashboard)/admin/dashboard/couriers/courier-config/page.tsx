'use client';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Table, Tag } from 'antd';
import Link from 'next/link';
import React from 'react';

const courierAccounts = [
    {
        id: 1,
        Courier: "TCS Express",
        Account: "ShopAdmin-TCS",
        Contact: "+92-21-111-123-456",
        "Merchant ID": "TCS-M-001",
        COD: "Enabled",
        Webhook: "https://api.shopadmin.com/webhooks/tcs",
        Status: "Active",
    },
    {
        id: 2,
        Courier: "Leopards Courier",
        Account: "ShopAdmin-Leopards",
        Contact: "+92-21-111-987-654",
        "Merchant ID": "LEO-M-014",
        COD: "Enabled",
        Webhook: "https://api.shopadmin.com/webhooks/leopards",
        Status: "Active",
    },
    {
        id: 3,
        Courier: "DHL Express",
        Account: "ShopAdmin-DHL",
        Contact: "+49-69-505-1234",
        "Merchant ID": "DHL-M-009",
        COD: "Disabled",
        Webhook: "https://api.shopadmin.com/webhooks/dhl",
        Status: "Inactive",
    },
    {
        id: 4,
        Courier: "FedEx",
        Account: "ShopAdmin-FedEx",
        Contact: "+1-800-463-3339",
        "Merchant ID": "FDX-M-021",
        COD: "Disabled",
        Webhook: "https://api.shopadmin.com/webhooks/fedex",
        Status: "Active",
    },
];

const CourierConfig = () => {

    const columns = [
        {
            title: "Courier",
            dataIndex: "Courier",
            key: "courier",
        },
        {
            title: "Account",
            dataIndex: "Account",
            key: "account",
        },
        {
            title: "Contact",
            dataIndex: "Contact",
            key: "contact",
        },
        {
            title: "Merchant ID",
            dataIndex: "Merchant ID",
            key: "merchantId",
        },
        {
            title: "COD",
            dataIndex: "COD",
            key: "cod",
            render: (value: string) => (
                <Tag color={value === "Enabled" ? "green" : "red"}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Webhook",
            dataIndex: "Webhook",
            key: "webhook",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "status",
            render: (value: string) => (
                <Tag color={value === "Active" ? "green" : "orange"}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "",
            render: (_: string, record: any) => (<Link href={`/admin/dashboard/couriers/courier-config/update-courier/${record.id}`}>
                <Button
                    icon={<EditOutlined />}
                    type='text'></Button>
            </Link>),
        },
    ];



    return (
        <div>

            <div style={{ marginBottom: '24px' }}>
                <PageHeader title="Courier Configurations" breadcrumb={adminBreadcrumb}></PageHeader>
                <p>API integration settings for each courier</p>
            </div>


            <Card>
                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={courierAccounts}
                        bordered
                        pagination={false}
                    />
                </div>
            </Card>
        </div>
    );
};

export default CourierConfig;