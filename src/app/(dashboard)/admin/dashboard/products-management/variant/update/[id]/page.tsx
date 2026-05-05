"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Row,
  Col,
  Spin,
} from "antd";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

export default function VariantUpdateForm() {
  const swal = useSwal();
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();

  /* 🔹 Fetch existing variant */
  const { data, isLoading } = useQuery({
    queryKey: ["variant", id],
    enabled: !!id,
    queryFn: async () => api.get(`/variant/${id}`),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => api.get(`/products?sortBy=createdAt&sortOrder=DESC`),
  });

  const variant = data?.data?.data;

  /* 🔹 Update mutation */
  const updateVariant = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any) => api.patch(`/variant/${id}`, payload),
    onSuccess: () => {
      swal.success("variant has been updated");
      router.back();
    },
    onError: () => {
      swal.error("Something went wrong!");
    },
  });

  /* 🔹 Set form values when data arrives */
  useEffect(() => {
    if (variant) {
      form.setFieldsValue({
        product_id: Number(variant.product_id),
        name: variant.name,
        sku: variant.sku,
        barcode: variant.barcode,
        cost_price: Number(variant.cost_price),
        sale_price: Number(variant.sale_price),
        stock_alert_qty: variant.stock_alert_qty,
        status: variant.status,
      });
    }
  }, [variant, form]);

  if (isLoading) return <Spin size="large" />;

  return (
    <Card
      title="Update Variant"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => updateVariant.mutate(values)}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Product"
              name="product_id"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select product"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={products?.data?.data?.data?.map((c: any) => ({
                  label: c.name,
                  value: Number(c.id),
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Variant Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Barcode" name="barcode">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Cost Price"
              name="cost_price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Sale Price"
              name="sale_price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Stock Alert Quantity"
              name="stock_alert_qty"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Status" name="status">
              <Select>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateVariant.isPending}
          >
            Update Variant
          </Button>
        </Row>
      </Form>
    </Card>
  );
}
