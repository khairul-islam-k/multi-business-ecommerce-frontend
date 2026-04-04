import { Card, Table, Tag } from 'antd';
import React from 'react';

const TopCustomersTable = () => {
    const customers = [
        {
            id: 1,
            Customer: "Ayesha Siddiqui",
            City: "Karachi",
            Orders: 91,
            Spent: "Rs 312,000",
            Returns: 4,
            Source: "Facebook",
        },
        {
            id: 2,
            Customer: "Ahmed Raza",
            City: "Lahore",
            Orders: 67,
            Spent: "Rs 245,500",
            Returns: 2,
            Source: "Website",
        },
        {
            id: 3,
            Customer: "Sara Khan",
            City: "Islamabad",
            Orders: 48,
            Spent: "Rs 189,000",
            Returns: 1,
            Source: "Instagram",
        },
        {
            id: 4,
            Customer: "Usman Ali",
            City: "Rawalpindi",
            Orders: 73,
            Spent: "Rs 276,300",
            Returns: 5,
            Source: "Google Ads",
        },
        {
            id: 5,
            Customer: "Fatima Noor",
            City: "Karachi",
            Orders: 59,
            Spent: "Rs 214,800",
            Returns: 3,
            Source: "Referral",
        },
        {
            id: 6,
            Customer: "Bilal Ahmed",
            City: "Faisalabad",
            Orders: 34,
            Spent: "Rs 128,900",
            Returns: 0,
            Source: "Walk-in",
        },
    ];

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Customer",
            dataIndex: "Customer",
            key: "Customer",
        },
        {
            title: "City",
            dataIndex: "City",
            key: "City",
        },
        {
            title: "Orders",
            dataIndex: "Orders",
            key: "Orders",
        },
        {
            title: "Spent",
            dataIndex: "Spent",
            key: "Spent",
        },
        {
            title: "Returns",
            dataIndex: "Returns",
            key: "Returns",
        },
        {
            title: "Source",
            dataIndex: "Source",
            key: "Source",
            render: (source: string) => {
                const colors: Record<string, string> = {
                    Facebook: "blue",
                    Website: "purple",
                    Instagram: "pink",
                    "Google Ads": "gold",
                    Referral: "green",
                    "Walk-in": "gray",
                };
                return <Tag color={colors[source]}>{source}</Tag>;
            },
        },
    ];

    return (
        <div>
            <Card style={{overflow: 'auto', marginTop: '10px'}}>
                <Table
                    columns={columns}
                    dataSource={customers}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default TopCustomersTable;