"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { EyeOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Grid, Input, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const productData = [
    {
        id: 1,
        tenant_id: 101,
        company_id: 1001,
        brand_id: 501,
        category_id: 201,
        name: "Wireless Mouse",
        slug: "wireless-mouse",
        sku: "WM-001",
        barcode: "1234567890123",
        short_description: "Ergonomic wireless mouse",
        long_description: "High precision wireless mouse with ergonomic design and long battery life.",
        cost_price: 15.0,
        sale_price: 25.0,
        compare_price: 30.0,
        tax_type: "VAT",
        tax_amount: 2.0,
        weight: 0.2,
        status: "Active",
        is_featured: true,
        published_at: "2025-03-20 10:00:00",
    },
    {
        id: 2,
        tenant_id: 101,
        company_id: 1001,
        brand_id: null,
        category_id: 202,
        name: "Bluetooth Headphones",
        slug: "bluetooth-headphones",
        sku: "BH-002",
        barcode: null,
        short_description: "Wireless bluetooth headphones",
        long_description: "Over-ear bluetooth headphones with noise cancellation and high-quality sound.",
        cost_price: 35.0,
        sale_price: 50.0,
        compare_price: null,
        tax_type: "GST",
        tax_amount: 5.0,
        weight: 0.5,
        status: "Active",
        is_featured: false,
        published_at: "2025-03-21 12:30:00",
    },
    {
        id: 3,
        tenant_id: 101,
        company_id: 1001,
        brand_id: 502,
        category_id: 203,
        name: "USB-C Charger",
        slug: "usb-c-charger",
        sku: "UC-003",
        barcode: "9876543210987",
        short_description: "Fast charging USB-C adapter",
        long_description: "High-speed USB-C charger compatible with multiple devices.",
        cost_price: 10.0,
        sale_price: 18.0,
        compare_price: 20.0,
        tax_type: "VAT",
        tax_amount: 1.5,
        weight: 0.1,
        status: "Inactive",
        is_featured: false,
        published_at: null,
    },
];


const ProductsList = () => {
    const screens = Grid.useBreakpoint();
    const router = useRouter();

    const productColumns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Cost Price", dataIndex: "cost_price", key: "cost_price" },
        { title: "Sale Price", dataIndex: "sale_price", key: "sale_price" },
        { title: "Compare Price", dataIndex: "compare_price", key: "compare_price" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
            ),
        },
        {
            title: "Featured",
            dataIndex: "is_featured",
            key: "is_featured",
            render: (featured: boolean) => (featured ? "Yes" : "No"),
        },
        { title: "Published At", dataIndex: "published_at", key: "published_at" },
        {
            title: "",
            render: (_: any, record: any) => (
                <Flex>
                    <Link href={`/admin/dashboard/products-management/products/detail/${record.id}`}>
                        <Button type="text" icon={<EyeOutlined />} />
                    </Link>

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "edit",
                                    label: "Edit",
                                    onClick: () => router.push(`/admin/dashboard/products-management/products/edit/${record.id}`),
                                },
                                {
                                    key: "delete",
                                    danger: true,
                                    label: "Delete",
                                },
                            ],
                        }}
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Flex>
            ),
        },
    ];

    const handleSearch = (searchData: string) => {
        console.log("search", searchData);
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Products List' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>All Products here</p>

            {/* Search field */}
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
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/admin/dashboard/products-management/products/create')}
                >
                    New Product
                </Button>
            </Flex>


            <Card style={{ overflow: 'auto' }}>
                <Table
                    rowKey="id"
                    columns={productColumns}
                    dataSource={productData}
                    bordered
                    pagination={false}
                />
            </Card>

        </div>
    );
};

export default ProductsList;