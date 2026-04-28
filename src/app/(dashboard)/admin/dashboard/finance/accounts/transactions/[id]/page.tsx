"use client";

import { notFound, useParams } from "next/navigation";
import { Card, Typography, Row, Col, Divider, Badge } from "antd";

import { mockTransactions } from "../data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

const statusColors: Record<string, any> = {
  Completed: "success",
  Pending: "warning",
  Failed: "error",
};

export default function TransactionDetails() {
  const { id } = useParams();
  const transaction = mockTransactions.find(
    (transaction) => transaction.id === id,
  );

  if (!transaction) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Transaction Details" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        {/* Transaction Info */}
        <Col xs={24} md={12}>
          <Card>
            <Title level={5}>Transaction Info</Title>

            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <Text type="secondary">Transaction ID</Text>
                <Text className="font-medium">{transaction.id}</Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Type</Text>
                <Text className="font-medium">{transaction.type}</Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Date</Text>
                <Text className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Status</Text>
                <Badge
                  status={statusColors[transaction.status] || "default"}
                  text={transaction.status}
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Financial Details */}
        <Col xs={24} md={12}>
          <Card>
            <Title level={5}>Financial Details</Title>

            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <Text type="secondary">Account</Text>
                <Text className="font-medium">{transaction.account}</Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Amount</Text>
                <Text className="font-mono">
                  ${transaction.amount.toLocaleString()}
                </Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Debit</Text>
                <Text className="font-mono">
                  {transaction.debit
                    ? `$${transaction.debit.toLocaleString()}`
                    : "—"}
                </Text>
              </div>

              <div className="flex justify-between">
                <Text type="secondary">Credit</Text>
                <Text className="font-mono">
                  {transaction.credit
                    ? `$${transaction.credit.toLocaleString()}`
                    : "—"}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Additional Info */}
        <Col span={24}>
          <Card>
            <Title level={5}>Additional Info</Title>

            <div className="space-y-4 mt-4">
              <div className="flex justify-between">
                <Text type="secondary">Reference</Text>
                <Text className="font-medium">
                  {transaction.refType}: {transaction.refId}
                </Text>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div>
                <Text type="secondary">Description</Text>
                <p className="mt-1">{transaction.description}</p>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div className="flex justify-between">
                <Text type="secondary">Created By</Text>
                <Text className="font-medium">{transaction.createdBy}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
