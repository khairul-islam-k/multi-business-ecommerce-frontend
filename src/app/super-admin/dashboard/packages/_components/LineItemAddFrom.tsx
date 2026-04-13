"use client";
import React, { useState } from "react";
import { Table, Input, InputNumber, Button, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

type LineItem = {
    id: number;
    name: string,
    slug: string,
    detail: string,
    routePath: string,
    status: string;
};

const LineItemAddFrom = () => {
    const [items, setItems] = useState<LineItem[]>([
        {
            id: Date.now(),
            name: "",
            slug: "",
            detail: '',
            routePath: '',
            status: ''
        },
    ]);

    console.log('items', items);

    // Add new row
    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now(),
                name: "",
                slug: "",
                detail: '',
                routePath: '',
                status: ''
            },
        ]);
    };

    // Remove row
    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Update row
    const updateItem = (
        id: number,
        field: keyof LineItem,
        value: string | number
    ) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };


    const columns = [
        {
            title: "name",
            render: (_: any, record: LineItem) => (
                <Input
                    placeholder="name"
                    value={record.name}
                    onChange={e =>
                        updateItem(record.id, "name", e.target.value)
                    }
                />
            ),
        },
        {
            title: "slug",
            render: (_: any, record: LineItem) => (
                <Input
                    placeholder="slug"
                    value={record.slug}
                    onChange={e =>
                        updateItem(record.id, "slug", e.target.value)
                    }
                />
            ),
        },
        {
            title: "routePath",
            render: (_: any, record: LineItem) => (
                <Input
                    placeholder='routePath'
                    value={record.routePath}
                    onChange={e =>
                        updateItem(record.id, "routePath", e.target.value)
                    }
                />
            ),
        },
        {
            title: "status",
            render: (_: any, record: LineItem) => (
                <Input
                    placeholder="status"
                    value={record.status}
                    onChange={e =>
                        updateItem(record.id, "status", e.target.value)
                    }
                />
            ),
        },
        {
            title: "detail",
            render: (_: any, record: LineItem) => (
                <Input
                    placeholder="detail"
                    value={record.detail}
                    onChange={e =>
                        updateItem(record.id, "detail", e.target.value)
                    }
                />
            ),
        },
        {
            width: 60,
            render: (_: any, record: LineItem) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(record.id)}
                />
            ),
        },
    ];

    return (
        <Card title="Line Items">
            <div style={{
                overflowX: 'auto',
                overflowY: 'hidden'
            }}>
                <Table
                    columns={columns}
                    dataSource={items}
                    rowKey="id"
                    pagination={false}
                    bordered
                />
            </div>

            <Button
                style={{ marginTop: 12 }}
                icon={<PlusOutlined />}
                onClick={addItem}
            >
                Add Feature
            </Button>
        </Card>
    );
};

export default LineItemAddFrom;