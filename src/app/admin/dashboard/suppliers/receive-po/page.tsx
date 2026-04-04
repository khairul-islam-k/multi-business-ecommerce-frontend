"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { Card, Select, Table, Tag } from 'antd';
import React from 'react';

const { Option } = Select;

const ReceivePurchaseOrder = () => {
    const Products = [
        {
            id: "PO-2026-002",
            category: "Global-Electronics",
            Product: "Wireless Earbuds",
            Variant: "_",
            Ordered: 150,
            Received: 150,
            Difference: 0
        },
        {
            id: "PO-2026-005",
            category: "ABC Textile",
            Product: "Wireless Earbuds",
            Variant: "_",
            Ordered: 150,
            Received: 150,
            Difference: 0
        }
    ];

    const columns = [
    {
      title: "Product",
      dataIndex: "Product",
      key: "Product",
    },
    {
      title: "Variant",
      dataIndex: "Variant",
      key: "Variant",
    },
    {
      title: "Ordered",
      dataIndex: "Ordered",
      key: "Ordered",
    },
    {
      title: "Received",
      dataIndex: "Received",
      key: "Received",
    },
    {
      title: "Difference",
      dataIndex: "Difference",
      key: "Difference",
      render: (value: number) => {
        if (value === 0) return <Tag color="green">Matched</Tag>;
        if (value > 0) return <Tag color="orange">Short</Tag>;
        return <Tag color="red">Over</Tag>;
      },
    },
  ];

  const handleIdChange = (id: string) => {
    console.log(id);
  }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Receive Purchase Order' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Record received goods against POs</p>

            <Card>
                <h3>Select Purchase Order</h3>
                {/* <Select
                onChange={(e) => handleIdChange(e.target.Value)}
                >
                    {
                        Products.map(product => 
                        <Option key={product.id} value={product.id}>{product.id}-{product.category}</Option>)
                    }
                </Select> */}
            </Card>

            <Table
                columns={columns}
                dataSource={Products}
                rowKey="id"
                pagination={false}
                bordered
            />

        </div>
    );
};

export default ReceivePurchaseOrder;