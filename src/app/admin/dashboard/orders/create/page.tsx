"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Input,
  InputNumber,
  Divider,
  Space,
  Spin,
  Empty,
} from "antd";
import { useQuery, useQueries } from "@tanstack/react-query";

import api from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";

const { TextArea } = Input;
const { Option } = Select;

/* =====================================================
   ORDER ITEMS COMPONENT
===================================================== */
function OrderItems({ onChange }: { onChange: (items: any[]) => void }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data?.data?.data ?? [];
    },
  });

  const [items, setItems] = useState<any[]>([]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: null,
        variant_id: null,
        product_name_snapshot: "",
        sku_snapshot: "",
        qty: 1,
        discount_amount: 0,
        unit_price: 0,
        total_price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index][key] = value;

      const qty = updated[index].qty || 0;
      const price = updated[index].unit_price || 0;
      const discount = updated[index].discount_amount || 0;

      updated[index].total_price = Math.max(qty * price - discount, 0);

      return updated;
    });
  };

  useEffect(() => {
    onChange(items);
  }, [items]);

  return (
    <Card
      title="Order Items"
      extra={
        <Button type="dashed" onClick={addItem}>
          + Add Item
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : products.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {items.length === 0 && <Empty description="No items added" />}

          {items.map((item, index) => {
            const product = products.find((p: any) => p.id === item.product_id);
            const variants = product?.variants || [];

            return (
              <Row gutter={12} key={index} align="middle">
                <Col span={6}>
                  <label className="text-sm font-semibold">Product</label>
                  <Select
                    placeholder="Select product"
                    value={item.product_id}
                    onChange={(v) => {
                      const p = products.find((x: any) => x.id === v);

                      updateItem(index, "product_id", v);
                      updateItem(index, "product_name_snapshot", p?.name || "");

                      updateItem(index, "variant_id", null);
                      updateItem(index, "sku_snapshot", "");
                      updateItem(index, "unit_price", 0);
                    }}
                    style={{ width: "100%" }}
                  >
                    {products.map((p: any) => (
                      <Option key={p.id} value={p.id}>
                        {p.name}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col span={6}>
                  <label className="text-sm font-semibold">Variant</label>
                  <Select
                    placeholder="Select variant"
                    value={item.variant_id}
                    onChange={(v) => {
                      const variant = variants.find((x: any) => x.id === v);

                      updateItem(index, "variant_id", v);
                      updateItem(index, "sku_snapshot", variant?.sku || "");
                      updateItem(index, "unit_price", variant?.price || 0);
                    }}
                    disabled={!item.product_id}
                    style={{ width: "100%" }}
                  >
                    {variants.map((v: any) => (
                      <Option key={v.id} value={v.id}>
                        {v.sku}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col span={3}>
                  <label className="text-sm font-semibold">Qty</label>
                  <InputNumber
                    min={1}
                    value={item.qty}
                    onChange={(v) => updateItem(index, "qty", v)}
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col span={3}>
                  <label className="text-sm font-semibold">Discount</label>
                  <InputNumber
                    min={0}
                    value={item.discount_amount}
                    onChange={(v) => updateItem(index, "discount_amount", v)}
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col span={4}>
                  <label className="text-sm font-semibold">Total</label>
                  <InputNumber
                    value={item.total_price}
                    disabled
                    style={{ width: "100%" }}
                  />
                </Col>

                <Col span={2}>
                  <Button danger onClick={() => removeItem(index)}>
                    X
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Space>
      )}
    </Card>
  );
}

/* =====================================================
   CREATE ORDER PAGE
===================================================== */
export default function CreateOrder() {
  const router = useRouter();
  const swal = useSwal();

  const results = useQueries({
    queries: [
      {
        queryKey: ["customers"],
        queryFn: async () => (await api.get("/customers")).data?.data ?? [],
      },
      {
        queryKey: ["companies"],
        queryFn: async () => (await api.get("/companies")).data?.data ?? [],
      },
      {
        queryKey: ["couriers"],
        queryFn: async () => (await api.get("/couriers")).data?.data ?? [],
      },
      {
        queryKey: ["suppliers"],
        queryFn: async () => (await api.get("/suppliers")).data?.data ?? [],
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);

  const [customers, companies, couriers, suppliers] = results.map(
    (r) => r.data?.data ?? [],
  );

  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    company_id: null,
    customer_id: null,
    courier_id: null,
    supplier_id: null,

    order_no: "",
    external_order_no: "",

    subtotal: 0,
    discount_amount: 0,
    shipping_charge: 0,
    total_amount: 0,

    note: "",
  });

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.total_price || 0), 0);

    setForm((prev) => ({
      ...prev,
      subtotal,
      total_amount:
        subtotal - (prev.discount_amount || 0) + (prev.shipping_charge || 0),
    }));
  }, [items]);

  const { handler, loading } = useSubmit(async () => {
    if (!items.length) return swal.error("Add at least one item");

    const orderRes = await api.post("/orders", form);
    console.log(orderRes);
    const orderId = orderRes.data.data.id;

    const payload = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name_snapshot: item.product_name_snapshot,
      sku_snapshot: item.sku_snapshot,
      qty: item.qty,
      discount_amount: item.discount_amount,
      total_price: item.total_price,
    }));

    await Promise.all(payload.map((item) => api.post("/order-items", item)));
    swal.success("Order created");
    queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "fetch-orders",
      });
    router.push("/admin/dashboard/orders");
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Order" breadcrumb={adminBreadcrumb} />

      <Row gutter={16}>
        {/* LEFT */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card loading={isLoading} title="Order Info">
              <Row gutter={12}>
                <Col span={12}>
                  <label className="text-sm font-semibold">Order No</label>
                  <Input
                    value={form.order_no}
                    onChange={(e) => set("order_no", e.target.value)}
                  />
                </Col>

                <Col span={12}>
                  <label className="text-sm font-semibold">
                    External Order No
                  </label>
                  <Input
                    value={form.external_order_no}
                    onChange={(e) => set("external_order_no", e.target.value)}
                  />
                </Col>

                <Col span={12} style={{ marginTop: 12 }}>
                  <label className="text-sm font-semibold">Customer</label>
                  <Select
                    value={form.customer_id}
                    onChange={(v) => set("customer_id", v)}
                    style={{ width: "100%" }}
                  >
                    {customers.map((c: any) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col span={12} style={{ marginTop: 12 }}>
                  <label className="text-sm font-semibold">Company</label>
                  <Select
                    value={form.company_id}
                    onChange={(v) => set("company_id", v)}
                    style={{ width: "100%" }}
                  >
                    {companies.map((c: any) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col span={24} style={{ marginTop: 12 }}>
                  <label className="text-sm font-semibold">Note</label>
                  <TextArea
                    rows={3}
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                  />
                </Col>
              </Row>
            </Card>

            <OrderItems onChange={setItems} />
          </Space>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={8}>
          <Card loading={isLoading}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <label className="text-sm font-semibold">Courier</label>
                <Select
                  value={form.courier_id}
                  onChange={(v) => set("courier_id", v)}
                  style={{ width: "100%" }}
                >
                  {couriers.map((c: any) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold">Supplier</label>
                <Select
                  value={form.supplier_id}
                  onChange={(v) => set("supplier_id", v)}
                  style={{ width: "100%" }}
                >
                  {suppliers.map((s: any) => (
                    <Option key={s.id} value={s.id}>
                      {s.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <Divider />

              <div>
                <label className="text-sm font-semibold">Subtotal</label>
                <InputNumber
                  value={form.subtotal}
                  disabled
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Order Discount</label>
                <InputNumber
                  value={form.discount_amount}
                  onChange={(v) => set("discount_amount", v)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Shipping</label>
                <InputNumber
                  value={form.shipping_charge}
                  onChange={(v) => set("shipping_charge", v)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Total</label>
                <InputNumber
                  value={form.total_amount}
                  disabled
                  style={{ width: "100%" }}
                />
              </div>

              <Divider />

              <Button type="primary" block onClick={handler} loading={loading}>
                Create Order
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
