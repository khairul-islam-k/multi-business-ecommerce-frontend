"use client";

import { useParams } from "next/navigation";
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
} from "antd";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  PackageCheck,
  RotateCcw,
  StopCircle,
  Truck,
  UserCheck,
} from "lucide-react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { useOrder, useOrderMutations, useOrderReturnsQuery } from "@/lib/api";
import type {
  OrderItemResponse,
  OrderPaymentPayload,
  OrderReturnStatus,
  OrderStatus,
} from "@/lib/api";
import AssignToCourierModal from "./_components/assign-to-courier-modal";
import { useState } from "react";

const { Text } = Typography;

const lifecycleButtonClass = {
  confirm:
    "border-blue-200 bg-blue-50 text-blue-700 hover:!border-blue-400 hover:!bg-blue-100 hover:!text-blue-800",
  process:
    "border-purple-200 bg-purple-50 text-purple-700 hover:!border-purple-400 hover:!bg-purple-100 hover:!text-purple-800",
  payment:
    "border-green-200 bg-green-50 text-green-700 hover:!border-green-400 hover:!bg-green-100 hover:!text-green-800",
  courier:
    "border-cyan-200 bg-cyan-50 text-cyan-700 hover:!border-cyan-400 hover:!bg-cyan-100 hover:!text-cyan-800",
  ship:
    "border-orange-200 bg-orange-50 text-orange-700 hover:!border-orange-400 hover:!bg-orange-100 hover:!text-orange-800",
  deliver:
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:!border-emerald-400 hover:!bg-emerald-100 hover:!text-emerald-800",
  cancel:
    "border-red-200 bg-red-50 text-red-700 hover:!border-red-400 hover:!bg-red-100 hover:!text-red-800",
};

const statusColor: Record<OrderStatus, string> = {
  CANCELLED: "red",
  CONFIRMED: "cyan",
  DELIVERED: "green",
  PLACED: "blue",
  PROCESSING: "purple",
  RETURNED: "orange",
  SHIPPED: "geekblue",
};

const returnStatusColor: Record<OrderReturnStatus, string> = {
  APPROVED: "blue",
  CANCELLED: "default",
  COMPLETED: "green",
  REJECTED: "red",
  REQUESTED: "orange",
};

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

function displayName(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const record = value as { name?: unknown; title?: unknown; sku?: unknown };
  return record.name ?? record.title ?? record.sku
    ? String(record.name ?? record.title ?? record.sku)
    : undefined;
}

export default function OrderDetails() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const { message, modal } = App.useApp();
  const [paymentForm] = Form.useForm<OrderPaymentPayload>();
  const orderId = String(id ?? "");
  const order = useOrder(businessId ?? "", orderId);
  const orderReturns = useOrderReturnsQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    orderId,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // courier assign modal
  const [courierModalOpen, setCourierModalOpen] = useState<boolean>(false);

  const accounts = useFinanceAccountQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const mutations = useOrderMutations(businessId ?? "");

  const runAction = (
    title: string,
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    modal.confirm({
      title,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        try {
          await action();
          message.success(successMessage);
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const openPaymentModal = () => {
    paymentForm.resetFields();
    modal.confirm({
      title: "Add order payment",
      icon: null,
      content: (
        <Form form={paymentForm} layout="vertical" className="mt-4">
          <Form.Item
            name="paymentMethod"
            label="Payment method"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                "CASH",
                "COD",
                "BKASH",
                "NAGAD",
                "CARD",
                "BANK_TRANSFER",
                "OTHER",
              ].map((method) => ({ label: method, value: method }))}
            />
          </Form.Item>
          <Form.Item
            name="financeAccountId"
            label="Finance account"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select finance account"
              loading={accounts.isLoading}
              options={(accounts.data?.items ?? []).map((account) => ({
                label: `${account.name} (${account.accountType})`,
                value: account.id,
              }))}
            />
          </Form.Item>
        </Form>
      ),
      okText: "Add payment",
      async onOk() {
        try {
          const values = await paymentForm.validateFields();
          await mutations.addPayment.mutateAsync({
            orderId,
            payload: values,
          });
          paymentForm.resetFields();
          message.success("Payment added.");
        } catch (error) {
          message.error(getApiErrorMessage(error));
          throw error;
        }
      },
    });
  };

  if (order.isLoading) return <Loader label="Loading order" />;
  if (!order.data) return <Empty description="Order not found" />;

  const current = order.data;
  const items = (current.items ?? []) as OrderItemResponse[];
  const payments = current.payments ?? [];
  const returns = orderReturns.data?.items ?? [];
  const statusLogs = current.statusLogs ?? [];

  // order status 
  const orderStatus = current.status ?? '';
  const canShip = ["CONFIRMED", "PROCESSING"].includes(orderStatus ?? "");

  const canDeliver = ["SHIPPED", "CONFIRMED", "PROCESSING"].includes(
    orderStatus ?? "",
  );
  const canCancel = !["DELIVERED", "CANCELLED"].includes(orderStatus ?? "");
  const canProcess = !(orderStatus === 'CONFIRMED');
  const canConfirm = !(orderStatus === 'PLACED');

  const isPayment = payments.map(singleData => singleData.paymentStatus).includes('PAID');

  return (
    <div className="space-y-6">
      <PageHeader
        title={current.orderNo ?? current.id}
        subtitle="Order details and lifecycle actions from the API."
        breadcrumb={adminBreadcrumb}
      />

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} lg={16}>
          <Card
            title="Order"
            extra={
              current.status ? (
                <Tag color={statusColor[current.status]}>{current.status}</Tag>
              ) : null
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Customer">
                {current.customerName ?? displayName(current.customer)}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {current.customerPhone ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Source">
                {current.orderSource ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment status">
                {current.paymentStatus ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Paid amount">
                {money(current.paidAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                {current.note ?? "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={`Items (${items.length})`} className="mt-4">
            <Table
              rowKey={(row) => String(row.id ?? JSON.stringify(row))}
              dataSource={items}
              pagination={false}
              columns={[
                {
                  title: "Product",
                  key: "product",
                  render: (_, row) =>
                    displayName(row.product),
                },
                {
                  title: "Variant",
                  key: "variant",
                  render: (_, row) => displayName(row.variant),
                },
                {
                  title: "Qty",
                  key: "quantity",
                  render: (_, row) =>
                    String(row?.item?.quantity),
                },
                {
                  title: "Total",
                  key: "lineTotal",
                  render: (_, row) =>
                    money(
                      (row?.item?.lineTotal),
                    ),
                },
              ]}
            />
          </Card>

          <Card title={`Payments (${payments.length})`} className="mt-4">
            <Table
              rowKey="id"
              dataSource={payments}
              pagination={false}
              columns={[
                {
                  title: "Payment No",
                  dataIndex: "paymentNo",
                  key: "paymentNo",
                  render: (value) => value ?? "-",
                },
                {
                  title: "Method",
                  dataIndex: "paymentMethod",
                  key: "paymentMethod",
                  render: (value) => value ?? "-",
                },
                {
                  title: "Status",
                  dataIndex: "paymentStatus",
                  key: "paymentStatus",
                  render: (value) => value ?? "-",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                  align: "right",
                  render: (value) => money(value),
                },
                {
                  title: "Paid at",
                  dataIndex: "paidAt",
                  key: "paidAt",
                  render: (value) =>
                    value ? new Date(String(value)).toLocaleString() : "-",
                },
              ]}
            />
          </Card>

          <Card
            title={`Returns (${returns.length})`}
            className="mt-4"
            extra={
              <Button
                size="small"
                icon={<RotateCcw size={16} />}
                href={`/admin/dashboard/orders/${orderId}/returns`}
              >
                View returns
              </Button>
            }
          >
            <Table
              rowKey="id"
              dataSource={returns}
              loading={orderReturns.isFetching}
              pagination={false}
              columns={[
                {
                  title: "Return No",
                  dataIndex: "returnNo",
                  key: "returnNo",
                  render: (value) => value ?? "-",
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (value: OrderReturnStatus | undefined) =>
                    value ? (
                      <Tag color={returnStatusColor[value]}>{value}</Tag>
                    ) : (
                      "-"
                    ),
                },
                {
                  title: "Reason",
                  dataIndex: "reason",
                  key: "reason",
                  render: (value) => value ?? "-",
                },
                {
                  title: "Amount",
                  dataIndex: "totalAmount",
                  key: "totalAmount",
                  align: "right",
                  render: (value) => money(value),
                },
                {
                  title: "Created",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (value) =>
                    value ? new Date(String(value)).toLocaleString() : "-",
                },
              ]}
            />
          </Card>

          <Card title={`Status History (${statusLogs.length})`} className="mt-4">
            {statusLogs.length ? (
              <Timeline
                items={statusLogs.map((log) => ({
                  color: log.toStatus ? statusColor[log.toStatus] : "blue",
                  children: (
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{log.fromStatus ?? "CREATED"}</Tag>
                        <ArrowRight size={14} className="text-gray-400" />
                        {log.toStatus ? (
                          <Tag color={statusColor[log.toStatus]}>
                            {log.toStatus}
                          </Tag>
                        ) : (
                          <Tag>UNKNOWN</Tag>
                        )}
                      </div>
                      {log.note ? (
                        <div className="text-sm text-gray-600">{log.note}</div>
                      ) : null}
                      <div className="text-xs text-gray-400">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "No timestamp"}
                      </div>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description="No status logs found" />
            )}
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
              <Descriptions.Item label="Tax">
                {money(current.taxTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {money(current.shippingCharge)}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <Text strong>{money(current.totalAmount)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Lifecycle" className="mt-4">
            <Space direction="vertical" className="w-full">
              <Button
                block
                disabled={canConfirm}
                icon={<UserCheck size={16} />}
                className={lifecycleButtonClass.confirm}
                onClick={() =>
                  runAction(
                    "Mark this order as Confirm?",
                    () => mutations.confirm.mutateAsync(orderId),
                    "Order Confirm successfully",
                  )
                }
              >
                Confirm Order
              </Button>

              <Button
                block
                disabled={canProcess}
                icon={<PackageCheck size={16} />}
                className={lifecycleButtonClass.process}
                onClick={() =>
                  runAction(
                    "Mark this order as Process?",
                    () => mutations.process.mutateAsync(orderId),
                    "Order Process successfully",
                  )
                }
              >
                Process Order
              </Button>

              <Button
                block
                disabled={isPayment}
                icon={<CreditCard size={16} />}
                className={lifecycleButtonClass.payment}
                onClick={openPaymentModal}
                loading={mutations.addPayment.isPending}
              >
                Add Payment
              </Button>

              <Button
                block
                icon={<Truck size={16} />}
                className={lifecycleButtonClass.ship}
                disabled={!canShip}
                onClick={() =>
                  runAction(
                    "Mark this order as shipped?",
                    () => mutations.shipOrder.mutateAsync(orderId),
                    "Order marked as shipped.",
                  )
                }
                loading={mutations.shipOrder.isPending}
              >
                Ship Order
              </Button>

              <Button
                block
                icon={<CheckCircle size={16} />}
                className={lifecycleButtonClass.deliver}
                disabled={!canDeliver}
                onClick={() =>
                  runAction(
                    "Mark this order as delivered?",
                    () => mutations.deliverOrder.mutateAsync(orderId),
                    "Order marked as delivered.",
                  )
                }
                loading={mutations.deliverOrder.isPending}
              >
                Deliver Order
              </Button>

              <Button
                block
                icon={<StopCircle size={16} />}
                className={lifecycleButtonClass.cancel}
                disabled={!canCancel}
                onClick={() =>
                  runAction(
                    "Cancel this order?",
                    () => mutations.cancelOrder.mutateAsync(orderId),
                    "Order cancelled.",
                  )
                }
                loading={mutations.cancelOrder.isPending}
              >
                Cancel Order
              </Button>

              <Button
                block
                onClick={()=> setCourierModalOpen(true)}
                icon={<Truck size={16} />}
                className={lifecycleButtonClass.courier}
              >
                Assign to Courier
              </Button>

            </Space>
          </Card>

        </Col>
      </Row>

      {/* courier assign modal */}
      <AssignToCourierModal
        open={courierModalOpen}
        orderId={orderId}
        onClose={() => setCourierModalOpen(false)}
      />

    </div>
  );
}
