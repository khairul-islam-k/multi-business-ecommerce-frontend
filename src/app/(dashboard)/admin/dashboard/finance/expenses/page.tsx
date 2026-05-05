"use client";

import { useState } from "react";
import { Table, Card, Typography, Row, Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { mockExpenses } from "./data";
import CreateExpense from "./_components/create-modal";
import ViewExpense from "./_components/view-modal";

const { Link } = Typography;

export default function ExpensesList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentExpense, setCurrentExpense] = useState<any>(null);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <Link
          onClick={() => {
            setCurrentExpense(mockExpenses.find((e) => e.id === r.id));
            setShowViewModal(true);
          }}
        >
          {r.title}
        </Link>
      ),
    },
    { title: "Category", dataIndex: "category_name" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Payment", dataIndex: "payment_method" },
    { title: "Date", dataIndex: "expense_date" },
  ];

  return (
    <div className="space-y-6">
      <Row justify="space-between">
        <div />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
        >
          New Expense
        </Button>
      </Row>

      <Card>
        <Table rowKey="id" columns={columns} dataSource={mockExpenses} />
      </Card>

      <Modal
        title="Create Expense"
        open={showCreateModal}
        okText="Create Expense"
        onCancel={() => setShowCreateModal(false)}
      >
        <CreateExpense />
      </Modal>

      <Modal
        title="View Expense Details"
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
      >
        <ViewExpense expense={currentExpense} />
      </Modal>
    </div>
  );
}
