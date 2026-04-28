"use client";
import React, { useState } from 'react';
import HistoryTable from './_components/HistoryTable';
import { Button, Card, Flex, Grid, Input, Select, Space } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const { Option } = Select;

const OrderHistory = () => {
    const screens = Grid.useBreakpoint();
    const [filterProduct, setFilterProduct] = useState<string>('All');
    console.log(filterProduct)

    const handleSearch = (data: string) => {
        console.log('search', data);
    }

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Customer Order History' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <p>Track all customer orders</p>

            <Card>
                {/* Search and filter */}
                <Flex
                    justify="space-between"
                    wrap="wrap"
                    style={{ marginBottom: '10px' }}
                >

                    <div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>Orders</h3>
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
                            <Option value="Delivered">Delivered</Option>
                            <Option value="Shipped">Shipped</Option>
                            <Option value="Processing">Processing</Option>
                            <Option value="Returned">Returned</Option>
                            <Option value="Cancelled">Cancelled</Option>
                        </Select>
                    </Space>
                </Flex>

                <HistoryTable />
            </Card>
        </div>
    );
};

export default OrderHistory;