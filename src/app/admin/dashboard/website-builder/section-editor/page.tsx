"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Grid, Select, Space } from 'antd';
import React, { useState } from 'react';
import SectionCollapse from './_components/SectionCollapse';
import ConfigCollapse from './_components/SectionCollapse';

const { Option } = Select;

const SectionEditor = () => {
    const [filterProduct, setFilterProduct] = useState<string>('Main Store-Home');
    const screens = Grid.useBreakpoint();

    return (
        <div>
            <div style={{
                marginBottom: '24px'
            }}>
                <PageHeader title='Section Editor' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Manage and configure page sections</p>

            {/* filter */}
            <Space style={{ marginBottom: 16 }}>
                <Select
                    value={filterProduct}
                    style={{
                        width: screens.lg? '200px': ''
                    }}
                    onChange={setFilterProduct}
                >
                    <Option value="Main Store-Home">Main Store-Home</Option>
                    <Option value="Main Store-About Us">Main Store-About Us</Option>
                    <Option value="Main Store-contact">Main Store-contact</Option>
                    <Option value="Main Store Product">Main Store Product</Option>
                    <Option value="Fashion Hub-Home">Fashion Hub-Home</Option>
                    <Option value="Tech Outlet-Home">Tech Outlet-Home</Option>
                </Select>

                <Button
                    icon={<PlusOutlined />}
                    type='primary'>Add Section</Button>
            </Space>

            {/* <SectionCollapse /> */}
            <ConfigCollapse />
        </div>
    );
};

export default SectionEditor;