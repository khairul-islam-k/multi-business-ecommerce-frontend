"use client";
import { Card, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

interface TPage {
    id: number;
    Title: string;
    Type: string;
    Slug: string;
    SEOTitle: string;
    Status: string;
}

const data: TPage[] = [
    {
        id: 1,
        Title: "Home",
        Type: "home",
        Slug: "/",
        SEOTitle: "Main Store - Home",
        Status: "published",
    },
    {
        id: 2,
        Title: "About Us",
        Type: "page",
        Slug: "/about-us",
        SEOTitle: "Learn More About Us",
        Status: "published",
    },
    {
        id: 3,
        Title: "Contact",
        Type: "page",
        Slug: "/contact",
        SEOTitle: "Get in Touch With Us",
        Status: "published",
    },
    {
        id: 4,
        Title: "Products",
        Type: "page",
        Slug: "/products",
        SEOTitle: "Our Products Catalog",
        Status: "published",
    },
];

const WebsitePage = () => {
    const columns: ColumnsType<TPage> = [
        {
            title: "Title",
            dataIndex: "Title",
            key: "Title",
            sorter: (a: TPage, b: TPage) => a.Title.localeCompare(b.Title),
        },
        {
            title: "Type",
            dataIndex: "Type",
            key: "Type",
        },
        {
            title: "Slug",
            dataIndex: "Slug",
            key: "Slug",
        },
        {
            title: "SEO Title",
            dataIndex: "SEOTitle",
            key: "SEOTitle",
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

export default WebsitePage;