"use client";

import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  ArrowLeft,
  Box,
  MapPin,
  PackageCheck,
  Truck,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useCourierMutation,
  useShippingDetails,
} from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ShipmentItem, ShipmentResponse } from "@/types/courier/courier";

import type { TableColumnsType } from "antd";
// import type {
//   ShipmentDetailsResponse,
//   ShipmentItem,
// } from "@/types/courier/shipment";

type ShipmentStatus =
  | "PENDING"
  | "BOOKED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED"
  | "CANCELLED";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus = "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";

const getShipmentStatusColor = (status?: string) => {
  const colors: Record<ShipmentStatus, string> = {
    PENDING: "orange",
    BOOKED: "blue",
    PICKED_UP: "cyan",
    IN_TRANSIT: "processing",
    DELIVERED: "green",
    FAILED: "red",
    RETURNED: "purple",
    CANCELLED: "default",
  };

  return colors[status as ShipmentStatus] ?? "default";
};

const getOrderStatusColor = (status?: string) => {
  const colors: Record<OrderStatus, string> = {
    PENDING: "orange",
    CONFIRMED: "blue",
    PROCESSING: "processing",
    COMPLETED: "green",
    CANCELLED: "red",
  };

  return colors[status as OrderStatus] ?? "default";
};

const getPaymentStatusColor = (status?: string) => {
  const colors: Record<PaymentStatus, string> = {
    UNPAID: "red",
    PAID: "green",
    PARTIAL: "orange",
    REFUNDED: "purple",
  };

  return colors[status as PaymentStatus] ?? "default";
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "৳0";

  return `৳${Number(value).toLocaleString("en-BD")}`;
};

const ShipmentDetails = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: shippingDetails,
    isLoading,
    isFetching,
  } = useShippingDetails(businessId, id);

  const { shipmentBook } = useCourierMutation(businessId);

  const handleBook = async (id: string) => {
    try {
      await shipmentBook.mutateAsync(id);
      swal.success("Shipment booked successfully");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const shipment = ((shippingDetails as { data?: ShipmentResponse })?.data ??
    shippingDetails) as ShipmentResponse | undefined;

  const itemColumns: TableColumnsType<ShipmentItem> = [
    {
      title: "Product",
      key: "product",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.product?.name ?? "-"}</p>
          <p className="m-0 text-xs text-gray-500">
            SKU: {row.product?.sku ?? "-"}
          </p>
        </div>
      ),
    },
    {
      title: "Variant",
      key: "variant",
      render: (_, row) =>
        row.variant ? (
          <div className="space-y-1">
            <p className="m-0 font-medium">{row.variant.title}</p>
            <p className="m-0 text-xs text-gray-500">SKU: {row.variant.sku}</p>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: "Unit Price",
      key: "unitPrice",
      render: (_, row) => formatMoney(row.orderItem?.unitPrice),
    },
    {
      title: "Discount",
      key: "discountAmount",
      render: (_, row) => formatMoney(row.orderItem?.discountAmount),
    },
    {
      title: "Tax",
      key: "taxAmount",
      render: (_, row) => formatMoney(row.orderItem?.taxAmount),
    },
    {
      title: "Line Total",
      key: "lineTotal",
      render: (_, row) => (
        <strong>{formatMoney(row.orderItem?.lineTotal)}</strong>
      ),
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Shipment Details"
          subtitle="View courier shipment details, order information, customer information, delivery address, and shipment items."
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Empty description="Shipment not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipment Details"
        subtitle={`Shipment No: ${shipment.shipmentNo}`}
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button icon={<ArrowLeft size={16} />} onClick={() => router.back()}>
          Back
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {shipment.consignmentId ? (
            <Button
              icon={<Truck size={16} />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/couriers/shipments/tracking/${shipment.id}`,
                )
              }
            >
              Track
            </Button>
          ) : null}

          <Button
            type="primary"
            icon={<PackageCheck size={16} />}
            onClick={() => handleBook(shipment.id)}
            disabled={shipment.status !== "PENDING"}
          >
            Book Shipment
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Shipment Status"
              value={shipment.status}
              prefix={<Truck size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Shipping Charge"
              value={formatMoney(shipment.shippingCharge)}
              prefix={<Box size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="COD Amount"
              value={formatMoney(shipment.codAmount)}
              prefix={<PackageCheck size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Items"
              value={shipment.items?.length ?? 0}
              prefix={<Box size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Shipment Information">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          <Descriptions.Item label="Shipment No">
            <strong>{shipment.shipmentNo}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Courier">
            {shipment.courier?.name ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Courier Code">
            {shipment.courier?.code ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Consignment ID">
            {shipment.consignmentId ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Tracking Code">
            {shipment.trackingCode ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Provider Status">
            {shipment.providerStatus ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={getShipmentStatusColor(shipment.status)}>
              {shipment.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDateTime(shipment.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {formatDateTime(shipment.updatedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Shipped At">
            {formatDateTime(shipment.shippedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Delivered At">
            {formatDateTime(shipment.deliveredAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Cancelled At">
            {formatDateTime(shipment.cancelledAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Recipient Information</span>
              </div>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Recipient Name">
                {shipment.recipientName}
              </Descriptions.Item>

              <Descriptions.Item label="Recipient Phone">
                {shipment.recipientPhone}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Address">
                {shipment.deliveryAddressSnapshot?.address ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Area">
                {shipment.deliveryAreaName}
              </Descriptions.Item>

              <Descriptions.Item label="Division / District">
                {shipment.deliveryDivisionName}
              </Descriptions.Item>

              <Descriptions.Item label="Post Code">
                {shipment.deliveryPostCode}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Pickup Information</span>
              </div>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Warehouse">
                {shipment.pickupWarehouse?.name ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Warehouse Phone">
                {shipment.pickupWarehouse?.phone ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Warehouse Address">
                {shipment.pickupWarehouse?.address ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Pickup Area">
                {shipment.pickupAreaName}
              </Descriptions.Item>

              <Descriptions.Item label="Pickup Post Code">
                {shipment.pickupPostCode}
              </Descriptions.Item>

              <Descriptions.Item label="Pickup Store ID">
                {shipment.pickupStoreId}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Order Information">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          <Descriptions.Item label="Order No">
            <strong>{shipment.order?.orderNo ?? "-"}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Order Type">
            {shipment.order?.orderType ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Order Source">
            {shipment.order?.orderSource ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Order Status">
            <Tag color={getOrderStatusColor(shipment.order?.status)}>
              {shipment.order?.status ?? "-"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Payment Status">
            <Tag color={getPaymentStatusColor(shipment.order?.paymentStatus)}>
              {shipment.order?.paymentStatus ?? "-"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="COD">
            {shipment.order?.isCod ? "Yes" : "No"}
          </Descriptions.Item>

          <Descriptions.Item label="Customer Name">
            {shipment.order?.customerName ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Customer Phone">
            {shipment.order?.customerPhone ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Customer Email">
            {shipment.order?.customerEmail ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Subtotal">
            {formatMoney(shipment.order?.subtotal)}
          </Descriptions.Item>

          <Descriptions.Item label="Shipping Charge">
            {formatMoney(shipment.order?.shippingCharge)}
          </Descriptions.Item>

          <Descriptions.Item label="Total Amount">
            <strong>{formatMoney(shipment.order?.totalAmount)}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Paid Amount">
            <strong>{formatMoney(shipment.order?.paidAmount)}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Note">
            {shipment.order?.note ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Courier Charge Summary">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Shipping Charge"
              value={formatMoney(shipment.shippingCharge)}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Delivery Charge"
              value={formatMoney(shipment.deliveryCharge)}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="COD Charge"
              value={formatMoney(shipment.codCharge)}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Courier Fee"
              value={formatMoney(shipment.courierFee)}
            />
          </Col>
        </Row>

        <Divider />

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Parcel Weight">
            {shipment.providerRequest?.parcelWeight ?? "-"} KG
          </Descriptions.Item>

          <Descriptions.Item label="Instruction">
            {shipment.providerRequest?.instruction ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Courier Mode">
            {shipment.courierConfig?.mode ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Webhook Configured">
            {shipment.courierConfig?.webhookConfigured ? (
              <Tag color="green">YES</Tag>
            ) : (
              <Tag color="red">NO</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Shipment Items">
        <Table
          rowKey="id"
          columns={itemColumns}
          dataSource={shipment.items ?? []}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default ShipmentDetails;
