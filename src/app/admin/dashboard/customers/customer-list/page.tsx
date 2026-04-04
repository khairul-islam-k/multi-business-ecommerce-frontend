"use client"
import React, { useState } from 'react';
import CustomerCard from './_components/CustomerCard';
import { Card, Grid, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomersTable from './_components/CustomersTable';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';


const { Option } = Select;

const CustomerList = () => {
    const screens = Grid.useBreakpoint();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");

    return (
        <div>

            {/* Header */}
            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Customers' breadcrumb={adminBreadcrumb} ></PageHeader>
            </div>

            <p>Manage your customer base</p>

            <CustomerCard />

            <Card title='All Customers'>

                {/* search variant */}
                <div
                    //  className="flex overflow-auto gap-2 mb-4"
                    style={{ display: 'flex', flexWrap: screens.xs ? 'wrap' : 'initial', gap: '8px', marginBottom: '8px' }}
                >
                    <Input
                        placeholder="Filter by name or email..."
                        prefix={<SearchOutlined />}
                        style={{ maxWidth: 280 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Select
                        value={statusFilter}
                        style={{ width: 140 }}
                        onChange={setStatusFilter}
                    >
                        <Option value="all">All Status</Option>
                        <Option value="Active">Active</Option>
                        <Option value="InActive">InActive</Option>
                    </Select>

                    <Select
                        value={sourceFilter}
                        style={{ width: 140 }}
                        onChange={setSourceFilter}
                    >
                        <Option value="All">All Sources</Option>
                        <Option value="Website">Website</Option>
                        <Option value="Facebook">Facebook</Option>
                        <Option value="Walk-in">Walk-in</Option>
                        <Option value="Instagram">Instagram</Option>
                        <Option value="Google Adds">Google Adds</Option>
                        <Option value="Referral">Referral</Option>
                    </Select>
                </div>

                {/* Table */}
                <CustomersTable />

            </Card>

        </div>
    );
};

export default CustomerList;