import { LayoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Flex, Grid, Input, Space, Table } from 'antd';
import React from 'react';

const dataSource = [
    {
        key: "1",
        Supplier: "ABC Textiles",
        "PO #": "PO-2026-001",
        Amount: "Rs 60,000",
        Method: "Bank Transfer",
        Reference: "TXN-20260310-001",
        Date: "3/10/2026",
        Note: "Advance 50%"
    },
    {
        key: "2",
        Supplier: "Global Electronics",
        "PO #": "PO-2026-002",
        Amount: "Rs 125,000",
        Method: "Cheque",
        Reference: "CHQ-20260312-004",
        Date: "3/12/2026",
        Note: "Full payment against invoice"
    },
    {
        key: "3",
        Supplier: "Pak Leather CO",
        "PO #": "PO-2026-003",
        Amount: "Rs 85,500",
        Method: "Cash",
        Reference: "CASH-20260315-002",
        Date: "3/15/2026",
        Note: "Advance payment for raw material"
    },
    {
        key: "4",
        Supplier: "Fashion Hub",
        "PO #": "PO-2026-004",
        Amount: "Rs 42,000",
        Method: "Bank Transfer",
        Reference: "TXN-20260318-007",
        Date: "3/18/2026",
        Note: "Balance payment"
    }
];


const PaymentTable = () => {
    const screens = Grid.useBreakpoint();
    const columns = [
        {
            title: "Supplier",
            dataIndex: "Supplier",
            key: "Supplier",
        },
        {
            title: "PO #",
            dataIndex: "PO #",
            key: "po",
        },
        {
            title: "Amount",
            dataIndex: "Amount",
            key: "Amount",
        },
        {
            title: "Payment Method",
            dataIndex: "Method",
            key: "Method",
        },
        {
            title: "Reference",
            dataIndex: "Reference",
            key: "Reference",
        },
        {
            title: "Date",
            dataIndex: "Date",
            key: "Date",
        },
        {
            title: "Note",
            dataIndex: "Note",
            key: "Note",
        },
    ];

    const handleSearch = (searchData: string) => {
        console.log('search', searchData);
    }

    return (
        <div style={{marginTop: "10px"}}>
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
                        }}><LayoutOutlined /> Payment Records</h3>
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
                    </Space>
                </Flex>

                <div style={{
                    overflowX: 'auto',
                    overflowY: "hidden"
                }}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </div>
            </Card>
        </div>
    );
};

export default PaymentTable;