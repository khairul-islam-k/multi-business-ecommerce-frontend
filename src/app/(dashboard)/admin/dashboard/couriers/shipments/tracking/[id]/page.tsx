"use client";

import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Truck,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Flex,
  Row,
  Spin,
  Statistic,
  Tag,
  Timeline,
  theme,
} from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useShipmentTracking } from "@/lib/api/hooks/courier";
import { useAuthStore } from "@/stores/auth.store";
import { ShipmentTrackingResponse } from "@/types/courier/courier";

type ShipmentStatus =
  | "PENDING"
  | "BOOKED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED"
  | "CANCELLED";

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

const formatStatus = (status?: string | null) => {
  if (!status) return "-";

  return status.replaceAll("_", " ");
};

const ShipmentTracking = () => {
  const router = useRouter();
  const { token } = theme.useToken();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { id } = useParams<{ id: string }>();

  const {
    data: tracking,
    isLoading,
    isFetching,
  } = useShipmentTracking(businessId, id);

  // If API returns direct object: { shipment, providerTracking }
  // If API returns wrapped object: { data: { shipment, providerTracking } }
  const trackingData =
    ((tracking as { data?: ShipmentTrackingResponse })?.data ??
      tracking) as ShipmentTrackingResponse | undefined;

  const shipment = trackingData?.shipment;
  const providerTracking = trackingData?.providerTracking?.tracking ?? [];

  const timelineItems = providerTracking.map((item, index) => ({
    key: `${item.time}-${index}`,
    dot: (
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "100%",
          background: token.colorPrimaryBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: token.colorPrimary,
        }}
      >
        <PackageCheck size={17} />
      </div>
    ),
    children: (
      <div className="pb-3">
        <h3 className="m-0 text-[15px] font-semibold">
          {item.message_en}
        </h3>

        <p className="m-0 mt-1 text-sm text-gray-500">
          {item.message_bn}
        </p>

        <p className="m-0 mt-1 text-xs text-gray-400">
          {formatDateTime(item.time)}
        </p>
      </div>
    ),
  }));

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
          title="Shipment Tracking"
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Empty description="Tracking data not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={shipment.trackingCode || shipment.consignmentId || shipment.shipmentNo}
        subtitle={`Shipment No: ${shipment.shipmentNo}`}
        breadcrumb={adminBreadcrumb}
      />

      <Button icon={<ArrowLeft size={16} />} onClick={() => router.back()}>
        Back
      </Button>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Shipment Status"
              value={formatStatus(shipment.status)}
              prefix={<Truck size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tracking Code"
              value={shipment.trackingCode ?? "-"}
              prefix={<PackageCheck size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Provider Status"
              value={formatStatus(shipment.providerStatus)}
              prefix={<CheckCircle2 size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Courier Fee"
              value={formatMoney(shipment.courierFee)}
              prefix={<PackageCheck size={18} />}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card style={{ height: "100%" }} title="Shipment Info">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Shipment No">
                <strong>{shipment.shipmentNo}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Consignment ID">
                {shipment.consignmentId ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Tracking Code">
                {shipment.trackingCode ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color={getShipmentStatusColor(shipment.status)}>
                  {formatStatus(shipment.status)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Provider Status">
                {formatStatus(shipment.providerStatus)}
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
        </Col>

        <Col xs={24} lg={12}>
          <Card style={{ height: "100%" }} title="Tracking Timeline">
            {timelineItems.length > 0 ? (
              <Timeline items={timelineItems} />
            ) : (
              <Empty description="No tracking timeline found" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <User size={18} />
                <span>Customer & Delivery</span>
              </Flex>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Recipient Name">
                {shipment.recipientName}
              </Descriptions.Item>

              <Descriptions.Item label="Recipient Phone">
                {shipment.recipientPhone}
              </Descriptions.Item>

              <Descriptions.Item label="Customer Name">
                {shipment.providerRequest?.customerName ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Customer Phone">
                {shipment.providerRequest?.customerPhone ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Address">
                {shipment.deliveryAddressSnapshot?.address ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="City">
                {shipment.deliveryAddressSnapshot?.city ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Country">
                {shipment.deliveryAddressSnapshot?.country ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Address Type">
                {shipment.deliveryAddressSnapshot?.addressType ?? "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <MapPin size={18} />
                <span>Pickup & Area Info</span>
              </Flex>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Delivery Area">
                {shipment.deliveryAreaName}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Division">
                {shipment.deliveryDivisionName}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Post Code">
                {shipment.deliveryPostCode}
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

              <Descriptions.Item label="Pickup Warehouse ID">
                {shipment.pickupWarehouseId}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Parcel & Charge Info">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          <Descriptions.Item label="Parcel Weight">
            {shipment.providerRequest?.parcelWeight ?? "-"} KG
          </Descriptions.Item>

          <Descriptions.Item label="Parcel Value">
            {formatMoney(shipment.providerRequest?.parcelValue)}
          </Descriptions.Item>

          <Descriptions.Item label="Cash Collection">
            {formatMoney(shipment.providerRequest?.cashCollectionAmount)}
          </Descriptions.Item>

          <Descriptions.Item label="Shipping Charge">
            {formatMoney(shipment.shippingCharge)}
          </Descriptions.Item>

          <Descriptions.Item label="Delivery Charge">
            {formatMoney(shipment.deliveryCharge)}
          </Descriptions.Item>

          <Descriptions.Item label="COD Charge">
            {formatMoney(shipment.codCharge)}
          </Descriptions.Item>

          <Descriptions.Item label="Courier Fee">
            <strong>{formatMoney(shipment.courierFee)}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Closed Box">
            {shipment.providerRequest?.isClosedBox ? (
              <Tag color="green">YES</Tag>
            ) : (
              <Tag color="red">NO</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Instruction">
            {shipment.providerRequest?.instruction ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Webhook Info">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Webhook Status">
            {shipment.lastWebhookPayload?.status ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Webhook Tracking Number">
            {shipment.lastWebhookPayload?.tracking_number ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDateTime(shipment.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {formatDateTime(shipment.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ShipmentTracking;