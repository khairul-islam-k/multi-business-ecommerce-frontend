"use client";

import { useState } from "react";
import { Table, Input, InputNumber, Button, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

type LineItem = {
  id: number;
  product: string;
  variant: string;
  qty: number;
  unitCost: number;
};

const LineItemsForm = () => {
  const [items, setItems] = useState<LineItem[]>([
    {
      id: Date.now(),
      product: "",
      variant: "",
      qty: 1,
      unitCost: 0,
    },
  ]);

  console.log("items", items);

  // Add new row
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        product: "",
        variant: "",
        qty: 1,
        unitCost: 0,
      },
    ]);
  };

  // Remove row
  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update row
  const updateItem = (
    id: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const columns = [
    {
      title: "Product",
      render: (_: any, record: LineItem) => (
        <Input
          placeholder="Product"
          value={record.product}
          onChange={(e) => updateItem(record.id, "product", e.target.value)}
        />
      ),
    },
    {
      title: "Variant",
      render: (_: any, record: LineItem) => (
        <Input
          placeholder="Variant"
          value={record.variant}
          onChange={(e) => updateItem(record.id, "variant", e.target.value)}
        />
      ),
    },
    {
      title: "Qty",
      width: 100,
      render: (_: any, record: LineItem) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => updateItem(record.id, "qty", value || 1)}
        />
      ),
    },
    {
      title: "Unit Cost",
      width: 140,
      render: (_: any, record: LineItem) => (
        <InputNumber
          min={0}
          value={record.unitCost}
          onChange={(value) => updateItem(record.id, "unitCost", value || 0)}
        />
      ),
    },
    {
      title: "Total",
      width: 120,
      render: (_: any, record: LineItem) => (
        <strong>Rs {record.qty * record.unitCost}</strong>
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
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
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
        Add Item
      </Button>

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <strong style={{ marginRight: 20 }}>
          Grand Total: Rs{" "}
          {items.reduce((sum, item) => sum + item.qty * item.unitCost, 0)}
        </strong>
      </div>
    </Card>
  );
};

export default LineItemsForm;
