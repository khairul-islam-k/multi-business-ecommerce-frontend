"use client";
import React from 'react';
import { Card, Tag, theme } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

type TDomain = {
        id: number;
        Domain: string;
        DNS: string;
        Status: string;
        Primary: string;
    };

const data: TDomain[] = [
    {
        id: 1,
        Domain: "mainstore.com",
        DNS: "verified",
        Status: "Active",
        Primary: "Primary"
    },
    {
        id: 2,
        Domain: "www.mainstore.com",
        DNS: "verified",
        Status: "Active",
        Primary: "-"
    },
];

const WebsiteDomain = () => {
    const {token} = theme.useToken();
    const columns: ColumnsType<TDomain> = [
            {
                title: "Domain",
                dataIndex: "Domain",
                key: "Domain",
            },
            {
                title: "DNS",
                dataIndex: "DNS",
                key: "DNS",
                render: (DNS: string) => <Tag>{DNS}</Tag>
            },
            {
                title: "Status",
                dataIndex: "Status",
                key: "Status",
                render: (Status: string) => <Tag>{Status}</Tag>
            },
            {
                title: "Primary",
                dataIndex: "Primary",
                key: "Primary",
                render: (Status: string) => <Tag style={{
                    background: Status === 'Primary'? token.colorPrimary : '',
                    color: Status === 'Primary'? token.colorPrimary : '',
                }}>{Status}</Tag>
            },
        ];

    return (
        <div>
            <Card>
                <div>
                    <Table dataSource={data}
                        columns={columns}
                        pagination={false}
                        rowKey="id" />
                </div>
            </Card>
        </div>
    );
};

export default WebsiteDomain;