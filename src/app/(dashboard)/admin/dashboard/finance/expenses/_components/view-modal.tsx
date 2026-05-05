"use client";

import { Typography } from "antd";

const { Text } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ViewExpense({ expense }: any) {
  return (
    <>
      <p>
        <Text strong>Title:</Text> {expense.title}
      </p>
      <p>
        <Text strong>Category:</Text> {expense.category_name}
      </p>
      <p>
        <Text strong>Amount:</Text> ${expense.amount}
      </p>
      <p>
        <Text strong>Payment:</Text> {expense.payment_method}
      </p>
      <p>
        <Text strong>Vendor:</Text> {expense.vendor_name}
      </p>
      <p>
        <Text strong>Date:</Text> {expense.expense_date}
      </p>
    </>
  );
}
