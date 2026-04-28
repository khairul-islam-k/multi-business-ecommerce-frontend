import { Card, Table, Tag } from 'antd';
import React from 'react';

const HistoryTable = () => {
    const orders = [
        {
            key: 1,
            order: "ORD-2026-001",
            date: "2026-03-28",
            items: 3,
            payment: "COD",
            total: "Rs 4,500",
            status: "Delivered",
        },
        {
            key: 2,
            order: "ORD-2026-002",
            date: "2026-03-29",
            items: 1,
            payment: "Online",
            total: "Rs 1,250",
            status: "Pending",
        },
        {
            key: 3,
            order: "ORD-2026-003",
            date: "2026-03-30",
            items: 5,
            payment: "COD",
            total: "Rs 9,800",
            status: "Shipped",
        },
        {
            key: 4,
            order: "ORD-2026-004",
            date: "2026-04-01",
            items: 2,
            payment: "Card",
            total: "Rs 3,200",
            status: "Cancelled",
        },
    ];

    const columns = [
        {
            title: "Order ID",
            dataIndex: "order",
            key: "order",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Items",
            dataIndex: "items",
            key: "items",
        },
        {
            title: "Payment",
            dataIndex: "payment",
            key: "payment",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "Delivered") color = "green";
                if (status === "Pending") color = "orange";
                if (status === "Cancelled") color = "red";
                if (status === "Shipped") color = "blue";

                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    return (
        <div>
            <Card style={{ overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            </Card>
        </div>
    );
};

export default HistoryTable;