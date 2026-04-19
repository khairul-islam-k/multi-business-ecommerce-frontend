"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import {
  Card,
  Table,
  Input,
  Button,
  Form,
  Select,
  Typography,
  message,
} from "antd";

import useSubmit from "@/hooks/use-submit";
import { mockOrders, mockReturns } from "../../data";
import { ReturnStatusBadge } from "../../_components/badge";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { TextArea } = Input;
const { Text } = Typography;

export default function OrderReturnForm() {
  const { id } = useParams();
  const swal = useSwal();

  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState("Unopened");
  const [refundAmount, setRefundAmount] = useState("");

  const order = mockOrders.find((order) => order.id === id);
  const returns = mockReturns.filter((_return) => _return.order_id === id);

  if (!order) return notFound();

  const { handler, loading } = useSubmit(async () => {
    await Promise.resolve(setTimeout(() => {}, 1000));
    swal.success("Return request submitted");
    setReason("");
    setCondition("Unopened");
    setRefundAmount("");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Return History" breadcrumb={adminBreadcrumb} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Existing Returns */}
        <Card title="Return History">
          {returns.length > 0 ? (
            <Table
              dataSource={returns}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Return #",
                  dataIndex: "return_no",
                  key: "return_no",
                  render: (v) => <Text code>{v}</Text>,
                },
                { title: "Reason", dataIndex: "reason", key: "reason" },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => <ReturnStatusBadge status={status} />,
                },
                {
                  title: "Refund",
                  dataIndex: "refund_amount",
                  key: "refund_amount",
                  align: "right",
                  render: (amt) => <Text code>${amt.toFixed(2)}</Text>,
                },
              ]}
            />
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              No returns for this order.
            </div>
          )}
        </Card>

        {/* New Return Form */}
        <Card title="New Return Request">
          <Form layout="vertical" onFinish={handler}>
            <Form.Item label="Reason" required>
              <TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the return reason..."
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item label="Condition" required>
              <Select value={condition} onChange={setCondition}>
                <Select.Option value="Unopened">Unopened</Select.Option>
                <Select.Option value="Used">Used</Select.Option>
                <Select.Option value="Damaged">Damaged</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Refund Amount" required>
              <Input
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Max: $${order.total.toFixed(2)}`}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Return
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
