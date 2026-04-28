"use client";

import { useState } from "react";
import { Button, Input, Card } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreateInvoice() {
  const [items, setItems] = useState([
    { id: 1, description: "", qty: 1, rate: 0 },
  ]);

  const addItem = () =>
    setItems([...items, { id: Date.now(), description: "", qty: 1, rate: 0 }]);

  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <PageHeader title="Create Invoice" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Button icon={<SaveOutlined />}>Save Draft</Button>
        <Button type="primary" icon={<SaveOutlined />}>
          Create & Send
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Line Items">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-5" placeholder="Description" />
                  <Input type="number" className="col-span-2" />
                  <Input type="number" className="col-span-2" />
                  <div className="col-span-2 text-right">
                    ৳{(item.qty * item.rate).toLocaleString()}
                  </div>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item.id)}
                  />
                </div>
              ))}
            </div>

            <div className="my-2" />

            <Button icon={<PlusOutlined />} onClick={addItem}>
              Add Item
            </Button>
          </Card>
        </div>

        <Card title="Summary">
          <p>Subtotal: ৳{subtotal}</p>
          <p>Tax: ৳{tax}</p>
          <p>Total: ৳{total}</p>
        </Card>
      </div>
    </div>
  );
}
