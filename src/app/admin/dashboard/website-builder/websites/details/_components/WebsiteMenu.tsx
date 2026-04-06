"use client";
import { Card } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React from 'react';

type TMenu = {
    id: number;
    Name: string;
    Location: string;
    Status: string;
};

const data: TMenu[] = [
    {
        id: 1,
        Name: "Main Navigation",
        Location: "header",
        Status: "Active",
    },
    {
        id: 2,
        Name: "Footer Links",
        Location: "footer",
        Status: "Active",
    }
];

const WebsiteMenu = () => {
    const columns: ColumnsType<TMenu> = [
        {
            title: "Name",
            dataIndex: "Name",
            key: "Name",
            render: (Name: string) => <strong>{Name}</strong>
        },
        {
            title: "Location",
            dataIndex: "Location",
            key: "Location",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
        },
    ];


    return (
        <div>
            <Card>
                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}>
                    <Table dataSource={data}
                        columns={columns}
                        pagination={false}
                        rowKey="id" />
                </div>
            </Card>
        </div>
    );
};

export default WebsiteMenu;