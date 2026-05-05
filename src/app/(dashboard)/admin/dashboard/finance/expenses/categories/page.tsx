"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Table,
  Button,
  Input,
  Row,
  Badge,
  Modal,
  Space,
  Select,
} from "antd";

import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";
import { mockExpenseCategories } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Search } = Input;

export default function ExpenseCategoriesList() {
  const swal = useSwal();
  const [showModal, setShowModal] = useState(false);

  const { handler, loading } = useSubmit(async () => {
    await Promise.resolve(setTimeout(() => {}, 1000));
    swal.success("Category created");
  });

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Status",
      dataIndex: "status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) =>
        record.status === "Active" ? (
          <Badge status="success" text={record.status} />
        ) : (
          <Badge status="error" text={record.status} />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Expense Categories" breadcrumb={adminBreadcrumb} />

      <Row justify="space-between">
        <Search placeholder="Search..." style={{ width: 300 }} />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Create Category
        </Button>
      </Row>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={mockExpenseCategories}
        />
      </Card>

      <Modal
        open={showModal}
        title="Create Expense Category"
        okText="Create"
        onOk={handler}
        loading={loading}
        onCancel={() => setShowModal(false)}
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Input placeholder="Name" />
          <Input.TextArea placeholder="Description" />
          <Select defaultValue="active">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Space>
      </Modal>
    </div>
  );
}
