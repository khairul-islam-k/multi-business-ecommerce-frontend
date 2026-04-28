"use client";

import { Input, Select, InputNumber, DatePicker, Space } from "antd";
import { mockExpenseCategories } from "../data";

export default function CreateExpense() {
  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <Input placeholder="Title" />

      <Select placeholder="Category">
        {mockExpenseCategories.map((c) => (
          <Select.Option key={c.id} value={c.id}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      <InputNumber placeholder="Amount" style={{ width: "100%" }} />

      <Select placeholder="Payment Method">
        <Select.Option value="cash">Cash</Select.Option>
        <Select.Option value="card">Card</Select.Option>
        <Select.Option value="bank">Bank</Select.Option>
      </Select>

      <Input placeholder="Vendor Name" />
      <DatePicker style={{ width: "100%" }} />
      <Input.TextArea placeholder="Note" />
    </Space>
  );
}
