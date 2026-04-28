'use client';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { Card, Table, Tag } from 'antd';
import Image from 'next/image';
import React from 'react';

const courierCompanies = [
    {
        id: 1,
        Logo: "https://upload.wikimedia.org/wikipedia/en/5/5b/TCS_Pakistan_Logo.png",
        Name: "TCS Express",
        Slug: "tcs-express",
        Type: "national",
        Status: "active",
    },
    {
        id: 2,
        Logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Leopards_Courier_Logo.png",
        Name: "Leopards Courier",
        Slug: "leopards-courier",
        Type: "national",
        Status: "active",
    },
    {
        id: 3,
        Logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/DHL_Logo.svg",
        Name: "DHL Express",
        Slug: "dhl-express",
        Type: "international",
        Status: "active",
    },
    {
        id: 4,
        Logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/FedEx_Express.svg",
        Name: "FedEx",
        Slug: "fedex",
        Type: "international",
        Status: "active",
    },
    {
        id: 5,
        Logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UPS_Logo_Shield_2017.svg",
        Name: "UPS",
        Slug: "ups",
        Type: "international",
        Status: "inactive",
    },
];


const CourierCompanies = () => {

    const columns = [
        {
            title: "Logo",
            dataIndex: "Logo",
            key: "logo",
            render: (logo: string) => (
                <Image
                    src={logo}
                    alt="Courier Logo"
                    width={60}
                    height={60}
                    unoptimized
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "Name",
            key: "name",
        },
        {
            title: "Slug",
            dataIndex: "Slug",
            key: "slug",
        },
        {
            title: "Type",
            dataIndex: "Type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "national" ? "blue" : "purple"}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <div>
            <div style={{
                marginBottom: '24px',
            }}>
                <PageHeader title='Courier Companies' breadcrumb={adminBreadcrumb}></PageHeader>
                <p>Manage delivery partners</p>
            </div>

            <Card>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={courierCompanies}
                    bordered
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default CourierCompanies;