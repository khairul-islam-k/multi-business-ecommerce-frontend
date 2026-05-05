"use client";

import { Input, Select, InputNumber, DatePicker, Space } from "antd";

import { mockExpenseCategories } from "../data";

export default function CreateExpense() {
  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <Input placeholder="Title" />

      <Select placeholder="Category">
        {mockExpenseCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <InputNumber placeholder="Amount" style={{ width: "100%" }} />

      <Select placeholder="Payment Method">
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="bank">Bank</option>
      </Select>

      <Input placeholder="Vendor Name" />
      <DatePicker style={{ width: "100%" }} />
      <Input.TextArea placeholder="Note" />
    </Space>
  );
}
