import { LayoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Flex, Grid, Input, Select, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

const products = [
    {
        id: 1,
        Product: "Cotton T-Shirt",
        Supplier: "ABC Textiles",
        SKU: "ABC-TS-001",
        Price: "Rs 350",
        "Lead Time": "7 days",
        "Min Qty": 50,
        Status: "active",
    },
    {
        id: 2,
        Product: "Denim Jeans",
        Supplier: "BlueWear Ltd",
        SKU: "BW-JN-014",
        Price: "Rs 1,850",
        "Lead Time": "12 days",
        "Min Qty": 30,
        Status: "active",
    },
    {
        id: 3,
        Product: "Leather Jacket",
        Supplier: "Urban Leather Co",
        SKU: "UL-JK-220",
        Price: "Rs 6,500",
        "Lead Time": "20 days",
        "Min Qty": 10,
        Status: "inactive",
    },
    {
        id: 4,
        Product: "Formal Shirt",
        Supplier: "Prime Apparel",
        SKU: "PA-FS-089",
        Price: "Rs 1,250",
        "Lead Time": "10 days",
        "Min Qty": 40,
        Status: "active",
    },
    {
        id: 5,
        Product: "Sports Hoodie",
        Supplier: "FlexFit Sports",
        SKU: "FF-HD-332",
        Price: "Rs 2,400",
        "Lead Time": "15 days",
        "Min Qty": 25,
        Status: "pending",
    },
];

const SupplierProductsTable = () => {
    const screens = Grid.useBreakpoint();

    const handleSearch = (data: string) => {
        console.log('data', data);
    }

    const [filterProduct, setFilterProduct] = useState<string>('All');

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Product",
            dataIndex: "Product",
            key: "Product",
        },
        {
            title: "Supplier",
            dataIndex: "Supplier",
            key: "Supplier",
        },
        {
            title: "SKU",
            dataIndex: "SKU",
            key: "SKU",
        },
        {
            title: "Price",
            dataIndex: "Price",
            key: "Price",
        },
        {
            title: "Lead Time",
            dataIndex: "Lead Time",
            key: "Lead Time",
        },
        {
            title: "Min Qty",
            dataIndex: "Min Qty",
            key: "Min Qty",
            // sorter: (a: any, b: any) => a["Min Qty"] - b["Min Qty"],
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (status: string) => {
                const colors: Record<string, string> = {
                    active: "green",
                    inactive: "red",
                    pending: "orange",
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div>

            <Card>
                <Flex
                    justify="space-between"
                    wrap="wrap"
                    style={{ marginBottom: '10px' }}
                >

                    <div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}><LayoutOutlined /> Product Catalog</h3>
                    </div>

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
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Space>
                </Flex>

                <div style={{overflow: 'auto'}}>
                    <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
                </div>
            </Card>
        </div>
    );
};

export default SupplierProductsTable;