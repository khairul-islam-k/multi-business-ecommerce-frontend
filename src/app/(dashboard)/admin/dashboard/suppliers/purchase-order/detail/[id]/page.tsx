"use client";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { usePurchaseOrder } from "@/lib/api/hooks/purchase-order";
import { useAuthStore } from "@/stores/auth.store";
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Table,
  Tag,
} from "antd";
import { useParams } from "next/navigation";

const PurchaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { message, modal } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: purchase, isLoading, isFetching } = usePurchaseOrder(
    businessId,
    id
  );

  console.log('purchase', purchase);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!purchase) {
    return <Empty description="Purchase order not found" />;
  }

  const handleReturnRequest = () => {
    modal.confirm({
      title: "Return request?",
      content: "Are you sure you want to create return request?",
      okText: "Return Request",
      cancelText: "Cancel",
      onOk: async () => {
        message.success("Return request action here.");
      },
    });
  };

  const handleComplete = () => {
    modal.confirm({
      title: "Complete purchase order?",
      content: "Are you sure you want to complete this purchase order?",
      okText: "Complete",
      cancelText: "Cancel",
      onOk: async () => {
        message.success("Complete action here.");
      },
    });
  };

  const handleCancel = () => {
    modal.confirm({
      title: "Cancel purchase order?",
      content: "Are you sure you want to cancel this purchase order?",
      okText: "Cancel Order",
      cancelText: "Close",
      okButtonProps: { danger: true },
      onOk: async () => {
        message.success("Cancel action here.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Order Details"
        subtitle="View purchase order, supplier, items, tax, and payment summary."
        breadcrumb={adminBreadcrumb}
      />

      <Flex justify="end" gap={10} wrap>
        <Button onClick={handleReturnRequest}>Return Request</Button>

        <Button type="primary" onClick={handleComplete}>
          Complete
        </Button>

        <Button danger onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>

      <Card>
        <Flex justify="space-between" align="center" wrap gap={12}>
          <div>
            <h2 className="m-0 text-xl font-semibold">
              {purchase.purchaseOrderNo}
            </h2>
            <p className="m-0 text-gray-500">{purchase.note || "No note"}</p>
          </div>

          <Tag color={purchase.status === "CANCELLED" ? "red" : "green"}>
            {purchase.status}
          </Tag>
        </Flex>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Order Information">
            <InfoItem label="Order Date" value={formatDate(purchase.orderDate)} />
            <InfoItem
              label="Expected Delivery"
              value={formatDate(purchase.expectedDeliveryDate)}
            />
            <InfoItem label="Warehouse ID" value={purchase.warehouseId} />
            <InfoItem label="Tax Rate" value={`${purchase.taxRate}%`} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Supplier Information">
            <InfoItem label="Name" value={purchase.supplier?.name ?? "-"} />
            <InfoItem
              label="Company"
              value={purchase.supplier?.companyName ?? "-"}
            />
            <InfoItem label="Email" value={purchase.supplier?.email ?? "-"} />
            <InfoItem label="Phone" value={purchase.supplier?.phone ?? "-"} />
            <InfoItem
              label="Address"
              value={
                purchase.supplier
                  ? `${purchase.supplier.address}, ${purchase.supplier.city}, ${purchase.supplier.country}`
                  : "-"
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title="Purchase Items">
        <Table
          rowKey="id"
          pagination={false}
          dataSource={purchase.items ?? []}
          columns={[
            {
              title: "Product ID",
              dataIndex: "productId",
            },
            {
              title: "Variant ID",
              dataIndex: "variantId",
              render: (value) => value || "-",
            },
            {
              title: "Qty Ordered",
              dataIndex: "quantityOrdered",
            },
            {
              title: "Qty Received",
              dataIndex: "quantityReceived",
            },
            {
              title: "Unit Cost",
              dataIndex: "unitCost",
              render: (value) => money(value),
            },
            {
              title: "Discount",
              dataIndex: "discountAmount",
              render: (value) => money(value),
            },
            {
              title: "Tax",
              dataIndex: "taxAmount",
              render: (value) => money(value),
            },
            {
              title: "Line Total",
              dataIndex: "lineTotal",
              render: (value) => money(value),
            },
          ]}
        />
      </Card>

      <Card title="Payment Summary">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Subtotal" value={money(purchase.subtotal)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem
              label="Discount"
              value={money(purchase.discountTotal)}
            />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Tax" value={money(purchase.taxTotal)} />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem
              label="Shipping"
              value={money(purchase.shippingCost)}
            />
          </Col>

          <Col xs={24} md={8} lg={4}>
            <InfoItem label="Total" value={money(purchase.totalAmount)} />
          </Col>
        </Row>
      </Card>

      <Card title="Tax Information">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <InfoItem label="Tax Name" value={purchase.tax?.name ?? "-"} />
          </Col>

          <Col xs={24} md={12}>
            <InfoItem
              label="Tax Rate"
              value={purchase.tax?.rate ? `${purchase.tax.rate}%` : "-"}
            />
          </Col>

          <Col xs={24}>
            <InfoItem
              label="Description"
              value={purchase.tax?.description ?? "-"}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PurchaseDetail;

type InfoItemProps = {
  label: string;
  value: React.ReactNode;
};

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="mb-3 rounded-lg border bg-gray-50 p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <div className="break-all font-medium">{value}</div>
    </div>
  );
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
};

const money = (value?: string | number | null) => {
  if (value === null || value === undefined) return "0";

  return Number(value).toLocaleString();
};
