"use client";

import Link from "next/link";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";

import { mockOrders } from "../data";
import {
  Card,
  Row,
  Col,
  Table,
  Tabs,
  Button,
  Typography,
  Badge,
  Modal,
  Select,
} from "antd";
import {
  TruckOutlined,
  BlockOutlined,
  ReloadOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { OrderNotesPanel } from "./_components/notes-panel";
import { OrderTimeline } from "./_components/timeline-panel";

const { Title, Text } = Typography;
const { Option } = Select;

export default function OrderDetails() {
  const { id } = useParams();
  const order = mockOrders.find((order) => order.id === id);
  const [courierVisible, setCourierVisible] = useState(false);
  const [supplierVisible, setSupplierVisible] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(order?.courier || "");
  const [selectedSupplier, setSelectedSupplier] = useState(
    order?.supplier || "",
  );

  console.log(order);

  if (!order) return notFound();

  const columns = [
    {
      title: "Product",
      dataIndex: "product_name_snapshot",
      key: "product",
    },
    {
      title: "SKU",
      dataIndex: "sku_snapshot",
      key: "sku",
      render: (sku: string) => <Text code>{sku}</Text>,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      align: "right" as const,
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: "Discount",
      dataIndex: "discount_amount",
      key: "discount",
      align: "right" as const,
      render: (v: number) => (v > 0 ? `-$${v.toFixed(2)}` : "—"),
    },
    {
      title: "Total",
      dataIndex: "total_price",
      key: "total",
      align: "right" as const,
      render: (v: number) => <Text strong>${v.toFixed(2)}</Text>,
    },
  ];

  const assignCourier = async () => {
    setCourierVisible(false);
    await Promise.resolve(setTimeout(() => {}, 1000));
  };

  const assignSupplier = async () => {
    setSupplierVisible(false);
    await Promise.resolve(setTimeout(() => {}, 1000));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Order Details" breadcrumb={adminBreadcrumb} />

      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ display: "inline", marginLeft: 10 }}>
            {order.order_no} <Badge status="processing" text={order.status} />
          </Title>
          <Text type="secondary" style={{ marginLeft: 10 }}>
            {order.customer_name} · {new Date(order.created_at).toDateString()}
          </Text>
        </Col>
        <Col>
          <Button
            icon={<TruckOutlined />}
            onClick={() => setCourierVisible(true)}
            style={{ marginRight: 8 }}
          >
            Assign Courier
          </Button>
          <Button
            icon={<BlockOutlined />}
            onClick={() => setSupplierVisible(true)}
            style={{ marginRight: 8 }}
          >
            Assign Supplier
          </Button>
          <Link href={`/admin/dashboard/orders/${order.id}/returns`}>
            <Button icon={<ReloadOutlined />} style={{ marginRight: 8 }}>
              Returns
            </Button>
          </Link>
          <Link href={`/admin/dashboard/orders/${order.id}/payments`}>
            <Button icon={<CreditCardOutlined />}>Payments</Button>
          </Link>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={16}>
        <Col span={16}>
          {/* Items Table */}
          <Card title={`Items (${order.items.length})`} variant="outlined">
            <Table
              columns={columns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={5} align="right" index={0}>
                    <Text strong>Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right" index={1}>
                    <Text strong>${order.total.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Card>

          {/* Tabs */}
          <Card>
            <Tabs defaultActiveKey="timeline">
              <Tabs.TabPane tab="Timeline" key="timeline">
                <OrderTimeline orderId={id as string} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Notes" key="notes">
                <OrderNotesPanel orderId={id as string} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col span={8} className="space-y-4">
          <Card title="Customer">
            <Text strong>{order.customer_name}</Text>
            <br />
            <Text type="secondary">{order.customer_email}</Text>
          </Card>

          <Card title="Fulfillment">
            <Row justify="space-between">
              <Text type="secondary">Channel</Text>
              <Text>{order.channel}</Text>
            </Row>
            <Row justify="space-between">
              <Text type="secondary">Region</Text>
              <Text>{order.region}</Text>
            </Row>
            <Row justify="space-between">
              <Text type="secondary">Courier</Text>
              <Text>{order.courier || "Unassigned"}</Text>
            </Row>
            <Row justify="space-between">
              <Text type="secondary">Supplier</Text>
              <Text>{order.supplier || "Unassigned"}</Text>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        title="Assign Courier"
        open={courierVisible}
        onOk={assignCourier}
        onCancel={() => setCourierVisible(false)}
        okButtonProps={{ disabled: !selectedCourier }}
      >
        <Select
          value={selectedCourier}
          onChange={setSelectedCourier}
          placeholder="Select courier"
          style={{ width: "100%", marginBottom: 6 }}
        >
          {["FedEx", "DHL", "UPS", "USPS", "Royal Mail", "Aramex"].map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>
        {order.courier && (
          <Text type="secondary">Currently assigned: {order.courier}</Text>
        )}
      </Modal>

      <Modal
        title="Assign Supplier"
        open={supplierVisible}
        onOk={assignSupplier}
        onCancel={() => setSupplierVisible(false)}
        okButtonProps={{ disabled: !selectedSupplier }}
      >
        <Select
          value={selectedSupplier}
          onChange={setSelectedSupplier}
          placeholder="Select supplier"
          style={{ width: "100%", marginBottom: 6 }}
        >
          {[
            "Warehouse A",
            "Warehouse B",
            "Drop Ship Co",
            "Local Supplier",
            "Global Dist",
          ].map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
        {order.supplier && (
          <Text type="secondary">Currently assigned: {order.supplier}</Text>
        )}
      </Modal>
    </div>
  );
}
