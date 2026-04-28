import React, { useState } from "react";
import { Card, Flex, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TopSelling {
    id: number;
    product: string;
    category: string;
    units_sold: number;
    revenue: number;
    rating: number;
    trend: "Up" | "Down" | "Stable";
}

const topSellingData: TopSelling[] = [
    { id: 1, product: "USB-C Charger", category: "Accessories", units_sold: 120, revenue: 2040, rating: 4.5, trend: "Up" },
    { id: 2, product: "Wireless Mouse", category: "Accessories", units_sold: 95, revenue: 2375, rating: 4.2, trend: "Up" },
    { id: 3, product: "USB-C Cable", category: "Cables", units_sold: 200, revenue: 2000, rating: 4.6, trend: "Stable" },
    { id: 4, product: "Wireless Keyboard", category: "Accessories", units_sold: 60, revenue: 2700, rating: 4.3, trend: "Down" },
    { id: 5, product: "Power Bank", category: "Electronics", units_sold: 45, revenue: 1575, rating: 4.7, trend: "Up" },
];

const columns: ColumnsType<TopSelling> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Units Sold", dataIndex: "units_sold", key: "units_sold" },
    { title: "Revenue ($)", dataIndex: "revenue", key: "revenue" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    {
        title: "Trend",
        dataIndex: "trend",
        key: "trend",
        render: (trend: TopSelling["trend"]) => {
            let color = trend === "Up" ? "green" : trend === "Down" ? "red" : "gray";
            return <Tag color={color}>{trend}</Tag>;
        },
    },
];

const { Option } = Select;


const TopSellingTable = () => {
    const [packageFilter, setPackageFilter] = useState("all");
    return (
        <div style={{marginTop: '16px'}}>

            <Card>
                <Flex justify="space-between"
                style={{marginBottom: '6px'}}
                align="center"
                wrap="wrap">
                    <div>
                        <h3 style={{fontSize: '20px'}}>Product Rankings</h3>
                        <p>Sorted by performance metrics</p>
                    </div>

                    <div>
                        <Select
                            value={packageFilter}
                            style={{ width: 140 }}
                            onChange={setPackageFilter}
                        >
                            <Option value="all">By Rating</Option>
                            <Option value="Starter">By Revenue</Option>
                            <Option value="Growth">By Quality</Option>
                        </Select>
                    </div>
                </Flex>

                <div style={{overflow: 'auto'}}>
                    <Table<TopSelling>
                    rowKey="id"
                    dataSource={topSellingData}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
                </div>
            </Card>

        </div>
    );
};

export default TopSellingTable;