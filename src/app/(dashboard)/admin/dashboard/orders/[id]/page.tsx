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
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  StopOutlined,
  TruckOutlined,
} from "@ant-design/icons";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import { getApiErrorMessage } from "@/lib/axios";
import { useOrder, useOrderMutations } from "@/lib/api";
import type { OrderPaymentPayload, OrderStatus } from "@/lib/api";

const { Text } = Typography;

const statusColor: Record<OrderStatus, string> = {
  CANCELLED: "red",
  CONFIRMED: "cyan",
  DELIVERED: "green",
  PENDING: "blue",
  PROCESSING: "purple",
  RETURNED: "orange",
  SHIPPED: "geekblue",
};

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

function displayName(value: unknown) {
  if (!value || typeof value !== "object") return "-";
  const record = value as { name?: unknown; title?: unknown; sku?: unknown };
  return String(record.name ?? record.title ?? record.sku ?? "-");
}

export default function OrderDetails() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const { message, modal } = App.useApp();
  const [paymentForm] = Form.useForm<OrderPaymentPayload>();
  const orderId = String(id ?? "");
  const order = useOrder(businessId ?? "", orderId);
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
  const items = (current.items ?? []) as Array<Record<string, unknown>>;

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
                    displayName(row.product) ||
                    String(row.productNameSnapshot ?? row.productId ?? "-"),
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
                    String(row.quantity ?? row.qty ?? row.quantityOrdered ?? "-"),
                },
                {
                  title: "Total",
                  key: "lineTotal",
                  render: (_, row) =>
                    money(
                      (row.lineTotal ??
                        row.totalPrice ??
                        row.total_amount) as string | number | null,
                    ),
                },
              ]}
            />
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
                icon={<CreditCardOutlined />}
                onClick={openPaymentModal}
                loading={mutations.addPayment.isPending}
              >
                Add payment
              </Button>
              <Button
                block
                icon={<TruckOutlined />}
                onClick={() =>
                  runAction(
                    "Mark this order as shipped?",
                    () => mutations.shipOrder.mutateAsync(orderId),
                    "Order marked as shipped.",
                  )
                }
                loading={mutations.shipOrder.isPending}
              >
                Ship order
              </Button>
              <Button
                block
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  runAction(
                    "Mark this order as delivered?",
                    () => mutations.deliverOrder.mutateAsync(orderId),
                    "Order marked as delivered.",
                  )
                }
                loading={mutations.deliverOrder.isPending}
              >
                Deliver order
              </Button>
              <Button
                block
                danger
                icon={<StopOutlined />}
                onClick={() =>
                  runAction(
                    "Cancel this order?",
                    () => mutations.cancelOrder.mutateAsync(orderId),
                    "Order cancelled.",
                  )
                }
                loading={mutations.cancelOrder.isPending}
              >
                Cancel order
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
