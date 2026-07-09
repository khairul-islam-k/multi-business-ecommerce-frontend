"use client";

import { Card, Col, Descriptions, Empty, Row, Table, Tag } from "antd";
import { useParams } from "next/navigation";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useSupplierInvoice } from "@/lib/api";

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

export default function SupplierInvoiceDetailsPage() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const invoice = useSupplierInvoice(businessId ?? "", String(id ?? ""));

  if (invoice.isLoading) return <Loader label="Loading supplier invoice" />;
  if (!invoice.data) return <Empty description="Supplier invoice not found" />;

  const current = invoice.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={current.invoiceNo}
        subtitle="Supplier invoice details from the API."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Invoice Summary">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Supplier">
                {current.supplier?.name ?? current.supplierId}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{current.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Invoice date">
                {new Date(current.invoiceDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Due date">
                {current.dueDate
                  ? new Date(current.dueDate).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                {current.note ?? "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Totals">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Subtotal">
                {money(current.subtotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {money(current.discountTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {money(current.shippingCost)}
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                {money(current.taxTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                {money(current.totalAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Paid">
                {money(current.paidAmount)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Items">
        <Table
          rowKey="id"
          dataSource={[]}
          columns={[]}
          pagination={false}
          locale={{
            emptyText:
              "Supplier invoice item details are not returned by this API yet.",
          }}
        />
      </Card>
    </div>
  );
}
