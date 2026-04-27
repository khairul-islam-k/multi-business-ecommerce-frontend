"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Spin,
  Empty,
  Descriptions,
  Input,
} from "antd";
import {
  TruckOutlined,
  BlockOutlined,
  ReloadOutlined,
  CreditCardOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import SearchableSelect from "@/components/shared/searchable-select";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { OrderNotesPanel } from "./_components/notes-panel";
import { OrderTimeline } from "./_components/timeline-panel";
import { useSwal } from "@/hooks/use-swal";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type ValueType = string | number;

type OrderItem = {
  id: string;
  product_name_snapshot: string;
  sku_snapshot?: string;
  qty: number;
  discount_amount?: string | number | null;
  total_price?: string | number | null;
};

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  status?: string | null;
};

type Supplier = {
  id: string;
  name?: string;
};

type Order = {
  id: string;
  uuid: string;
  createdAt: string;
  order_no?: string | null;
  external_order_no?: string | null;
  order_status?: string | null;
  payment_status?: string | null;
  payment_method?: string | null;
  source_channel?: string | null;
  courier_id?: string | null;
  supplier_id?: string | null;
  subtotal?: string | number | null;
  discount_amount?: string | number | null;
  shipping_charge?: string | number | null;
  total_amount?: string | number | null;
  note?: string | null;
  customer?: Customer | null;
  supplier?: Supplier | null;
  items?: OrderItem[];
};

const toMoney = (value?: string | number | null) => {
  const amount = Number(value ?? 0);
  return `$${amount.toFixed(2)}`;
};

export default function OrderDetails() {
  const swal = useSwal();
  const { id } = useParams();
  const uuid = id as string;

  const queryClient = useQueryClient();

  const [courierVisible, setCourierVisible] = useState(false);
  const [supplierVisible, setSupplierVisible] = useState(false);
  const [noteVisible, setNoteVisible] = useState(false);

  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<
    ValueType | undefined
  >();
  const [note, setNote] = useState("");

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order", uuid],
    queryFn: async () => {
      const res = await api.get(`/orders/${uuid}`);
      return res.data?.data;
    },
    enabled: !!uuid,
  });

  useEffect(() => {
    if (!order) return;

    setSelectedSupplier(order.supplier_id ?? undefined);
    setSelectedCourier(order.courier_id ?? "");
    setNote(order.note ?? "");
  }, [order]);

  const updateOrderMutation = useMutation({
    mutationFn: async (payload: Partial<Order>) => {
      const res = await api.patch(`/orders/${uuid}`, payload);
      return res.data?.data;
    },
    onSuccess: () => {
      swal.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["order", uuid] });
    },
    onError: () => {
      swal.error("Failed to update order");
    },
  });

  const assignSupplier = () => {
    if (!selectedSupplier) return;

    updateOrderMutation.mutate(
      { supplier_id: String(selectedSupplier) },
      {
        onSuccess: () => {
          setSupplierVisible(false);
        },
      },
    );
  };

  const assignCourier = () => {
    if (!selectedCourier) return;

    updateOrderMutation.mutate(
      { courier_id: selectedCourier },
      {
        onSuccess: () => {
          setCourierVisible(false);
        },
      },
    );
  };

  const saveNote = () => {
    updateOrderMutation.mutate(
      { note },
      {
        onSuccess: () => {
          setNoteVisible(false);
        },
      },
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "Product",
        dataIndex: "product_name_snapshot",
        key: "product",
        render: (value: string) => value || "—",
      },
      {
        title: "SKU",
        dataIndex: "sku_snapshot",
        key: "sku",
        render: (sku: string) => (sku ? <Text code>{sku}</Text> : "—"),
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        align: "center" as const,
      },
      {
        title: "Discount",
        dataIndex: "discount_amount",
        key: "discount",
        align: "right" as const,
        render: (v: string | number | null) =>
          Number(v ?? 0) > 0 ? `-${toMoney(v)}` : "—",
      },
      {
        title: "Total",
        dataIndex: "total_price",
        key: "total",
        align: "right" as const,
        render: (v: string | number | null) => <Text strong>{toMoney(v)}</Text>,
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return <Empty description="Order not found" />;
  }

  const items = order.items ?? [];
  const customer = order.customer;

  return (
    <div className="space-y-6">
      <PageHeader title="Order Details" breadcrumb={adminBreadcrumb} />

      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={3} style={{ display: "inline", marginLeft: 10 }}>
            {order.order_no || order.external_order_no || order.uuid}
          </Title>

          <Badge
            status="processing"
            text={order.order_status || "Unknown"}
            style={{ marginLeft: 12 }}
          />

          <div style={{ marginLeft: 10, marginTop: 4 }}>
            <Text type="secondary">
              {customer?.name || "Unknown customer"} ·{" "}
              {new Date(order.createdAt).toDateString()}
            </Text>
          </div>
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

          <Button
            icon={<PlusOutlined />}
            onClick={() => setNoteVisible(true)}
            style={{ marginRight: 8 }}
          >
            Add Note
          </Button>

          <Link href={`/admin/dashboard/orders/${order.uuid}/returns`}>
            <Button icon={<ReloadOutlined />} style={{ marginRight: 8 }}>
              Returns
            </Button>
          </Link>

          <Link href={`/admin/dashboard/orders/${order.uuid}/payments`}>
            <Button icon={<CreditCardOutlined />}>Payments</Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={`Items (${items.length})`} variant="outlined">
            <Table
              columns={columns}
              dataSource={items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} align="right" index={0}>
                      <Text strong>Subtotal</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right" index={1}>
                      {toMoney(order.subtotal)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>

                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} align="right" index={2}>
                      <Text strong>Discount</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right" index={3}>
                      {toMoney(order.discount_amount)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>

                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} align="right" index={4}>
                      <Text strong>Shipping</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right" index={5}>
                      {toMoney(order.shipping_charge)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>

                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={4} align="right" index={6}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right" index={7}>
                      <Text strong>{toMoney(order.total_amount)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Tabs
              defaultActiveKey="timeline"
              items={[
                {
                  key: "timeline",
                  label: "Timeline",
                  children: <OrderTimeline orderId={order.uuid} />,
                },
                {
                  key: "notes",
                  label: "Notes",
                  children: <OrderNotesPanel orderId={order.uuid} />,
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8} className="space-y-6">
          <Card title="Customer">
            {customer ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  {customer.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {customer.email || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {customer.phone || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                  {customer.source || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {customer.status || "—"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No customer data" />
            )}
          </Card>

          <Card title="Fulfillment">
            <Row justify="space-between">
              <Text type="secondary">Channel</Text>
              <Text>{order.source_channel || "—"}</Text>
            </Row>

            <Row justify="space-between">
              <Text type="secondary">Courier</Text>
              <Text>{order.courier_id || "Unassigned"}</Text>
            </Row>

            <Row justify="space-between">
              <Text type="secondary">Supplier</Text>
              <Text>
                {order.supplier?.name || order.supplier_id || "Unassigned"}
              </Text>
            </Row>
          </Card>

          <Card title="Payment">
            <Row justify="space-between">
              <Text type="secondary">Status</Text>
              <Text>{order.payment_status || "—"}</Text>
            </Row>

            <Row justify="space-between">
              <Text type="secondary">Method</Text>
              <Text>{order.payment_method || "—"}</Text>
            </Row>

            <Row justify="space-between">
              <Text type="secondary">Total</Text>
              <Text strong>{toMoney(order.total_amount)}</Text>
            </Row>
          </Card>

          <Card
            title="Order Note"
            extra={
              <Button type="link" onClick={() => setNoteVisible(true)}>
                Edit
              </Button>
            }
          >
            <Text>{order.note || "No note added"}</Text>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Assign Courier"
        open={courierVisible}
        onOk={assignCourier}
        onCancel={() => setCourierVisible(false)}
        confirmLoading={updateOrderMutation.isPending}
        okButtonProps={{ disabled: !selectedCourier }}
      >
        <Select
          value={selectedCourier || undefined}
          onChange={setSelectedCourier}
          placeholder="Select courier"
          style={{ width: "100%", marginBottom: 6 }}
          allowClear
        >
          {["FedEx", "DHL", "UPS", "USPS", "Royal Mail", "Aramex"].map(
            (courier) => (
              <Option key={courier} value={courier}>
                {courier}
              </Option>
            ),
          )}
        </Select>
      </Modal>

      <Modal
        title="Assign Supplier"
        open={supplierVisible}
        onOk={assignSupplier}
        onCancel={() => setSupplierVisible(false)}
        confirmLoading={updateOrderMutation.isPending}
        okButtonProps={{ disabled: !selectedSupplier }}
      >
        <SearchableSelect
          value={selectedSupplier}
          onChange={setSelectedSupplier}
          endpoint="/business-suppliers"
          placeholder="Search and select supplier"
          labelKey="name"
          valueKey="id"
        />

        {order.supplier_id && (
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Currently assigned: {order.supplier?.name || order.supplier_id}
          </Text>
        )}
      </Modal>

      <Modal
        title="Add / Edit Order Note"
        open={noteVisible}
        onOk={saveNote}
        onCancel={() => setNoteVisible(false)}
        confirmLoading={updateOrderMutation.isPending}
        okButtonProps={{ disabled: !note.trim() }}
      >
        <TextArea
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write an internal order note..."
          maxLength={1000}
          showCount
        />
      </Modal>
    </div>
  );
}
