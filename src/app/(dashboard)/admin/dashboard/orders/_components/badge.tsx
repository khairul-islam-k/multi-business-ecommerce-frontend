import { Badge } from "antd";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
type ReturnStatus = "requested" | "approved" | "received" | "refunded" | "rejected";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "orange" },
  processing: { label: "Processing", color: "blue" },
  shipped: { label: "Shipped", color: "cyan" },
  delivered: { label: "Delivered", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
  returned: { label: "Returned", color: "purple" },
};

const paymentConfig: Record<PaymentStatus, { label: string; color: string }> = {
  paid: { label: "Paid", color: "green" },
  pending: { label: "Pending", color: "orange" },
  refunded: { label: "Refunded", color: "purple" },
  failed: { label: "Failed", color: "red" },
};

const returnConfig: Record<ReturnStatus, { label: string; color: string }> = {
  requested: { label: "Requested", color: "orange" },
  approved: { label: "Approved", color: "blue" },
  received: { label: "Received", color: "cyan" },
  refunded: { label: "Refunded", color: "green" },
  rejected: { label: "Rejected", color: "red" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = statusConfig[status];
  return <Badge color={c.color} text={c.label} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const c = paymentConfig[status];
  return <Badge color={c.color} text={c.label} />;
}

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const c = returnConfig[status];
  return <Badge color={c.color} text={c.label} />;
}
