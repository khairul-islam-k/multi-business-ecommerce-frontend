"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Button, Card, Flex, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

type TProducts = {
  id: string;
  category: string;
  Product: string;
  Variant: string;
  Ordered: number;
  Received: number;
  Difference: number;
  status: string;
};

const Products: TProducts[] = [
  {
    id: "PO-2026-002",
    category: "Global-Electronics",
    status: "Pending",
    Product: "Cable ",
    Variant: "_",
    Ordered: 150,
    Received: 150,
    Difference: 0,
  },
  {
    id: "PO-2026-005",
    category: "ABC Textile",
    status: "Approved",
    Product: "Wireless Earbuds",
    Variant: "_",
    Ordered: 150,
    Received: 150,
    Difference: 0,
  },
];

const ReceivePurchaseOrder = () => {
  const [productId, SetProductId] = useState<string>(Products[0].id);
  const [allProducts, setAllProducts] = useState<TProducts[]>([]);

  useEffect(() => {
    const result = Products.filter((singleData) => singleData.id === productId);
    const handleData = () => {
      setAllProducts(result);
    };

    handleData();
  }, [productId]);

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

  const handleConfirm = () => {
    console.log(productId);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Receive Purchase Order"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>
      <p>Record received goods against POs</p>

      <Card>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Select Purchase Order
        </h3>
        <Select value={productId} onChange={(value) => SetProductId(value)}>
          {Products.map((product) => (
            <Option key={product.id} value={product.id}>
              {product.id}-{product.category}
            </Option>
          ))}
        </Select>
      </Card>

      <Card
        style={{
          marginTop: "16px",
        }}
      >
        {/* Search and filter */}
        <Flex
          justify="space-between"
          wrap="wrap"
          style={{ marginBottom: "10px" }}
        >
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {productId} Items
            </h3>
          </div>

          <div>
            <Tag
              style={{
                color: "white",
                background: "blue",
              }}
            >
              {allProducts[0]?.status}
            </Tag>
          </div>
        </Flex>

        <div style={{ overflow: "auto", marginBottom: "20px" }}>
          <Table
            columns={columns}
            dataSource={allProducts}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>

        <Button onClick={handleConfirm} type="primary">
          Confirm Receipt
        </Button>
      </Card>
    </div>
  );
};

export default ReceivePurchaseOrder;
