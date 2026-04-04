import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Grid, Input, Select, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

const purchaseOrders = [
    {
        id: 1,
        "PO #": "PO-2026-001",
        Supplier: "ABC Textiles",
        Warehouse: "Main Warehouse",
        Date: "2026-03-01",
        Expected: "2026-03-10",
        Total: "Rs 60,000",
        Status: "received",
    },
    {
        id: 2,
        "PO #": "PO-2026-002",
        Supplier: "BlueWear Ltd",
        Warehouse: "Central Warehouse",
        Date: "2026-03-03",
        Expected: "2026-03-12",
        Total: "Rs 85,500",
        Status: "pending",
    },
    {
        id: 3,
        "PO #": "PO-2026-003",
        Supplier: "Urban Leather Co",
        Warehouse: "Main Warehouse",
        Date: "2026-03-05",
        Expected: "2026-03-18",
        Total: "Rs 142,000",
        Status: "partial",
    },
    {
        id: 4,
        "PO #": "PO-2026-004",
        Supplier: "Prime Apparel",
        Warehouse: "North Warehouse",
        Date: "2026-03-08",
        Expected: "2026-03-15",
        Total: "Rs 48,750",
        Status: "cancelled",
    },
    {
        id: 5,
        "PO #": "PO-2026-005",
        Supplier: "FlexFit Sports",
        Warehouse: "Main Warehouse",
        Date: "2026-03-10",
        Expected: "2026-03-20",
        Total: "Rs 96,300",
        Status: "received",
    },
];

const PurchaseProductTable = () => {
    const screens = Grid.useBreakpoint();
    const [filterProduct, setFilterProduct] = useState<string>('All');
    const handleSearch = (data: string) => {
        console.log('data', data);
    }

    const columns = [
        {
            title: "PO #",
            dataIndex: "PO #",
            key: "po",
        },
        {
            title: "Supplier",
            dataIndex: "Supplier",
            key: "Supplier",
        },
        {
            title: "Warehouse",
            dataIndex: "Warehouse",
            key: "Warehouse",
        },
        {
            title: "Order Date",
            dataIndex: "Date",
            key: "Date",
        },
        {
            title: "Expected Date",
            dataIndex: "Expected",
            key: "Expected",
        },
        {
            title: "Total",
            dataIndex: "Total",
            key: "Total",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (status: string) => {
                const colors: Record<string, string> = {
                    received: "green",
                    pending: "orange",
                    partial: "blue",
                    cancelled: "red",
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div>
            <Card>

                {/* Search and filter */}
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

                        <Select
                            value={filterProduct}
                            style={{ width: 140 }}
                            onChange={setFilterProduct}
                        >
                            <Option value="All">Status All</Option>
                            <Option value="Draft">Draft</Option>
                            <Option value="Pending">Pending</Option>
                            <Option value="Approved">Approved</Option>
                            <Option value="Shipped">Shipped</Option>
                            <Option value="Received">Received</Option>
                            <Option value="Cancelled">Cancelled</Option>
                        </Select>
                    </Space>

                    <div>
                        <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        >Create PO</Button>
                    </div>
                </Flex>

                <Table
                    columns={columns}
                    dataSource={purchaseOrders}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default PurchaseProductTable;