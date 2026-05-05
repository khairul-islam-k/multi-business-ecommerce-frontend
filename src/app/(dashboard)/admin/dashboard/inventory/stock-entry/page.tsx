"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Row,
  Typography,
  Form as AntdForm,
  Input,
  InputNumber,
  Select,
  Button,
} from "antd";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;

export default function StockEntryPage() {
  const swal = useSwal();
  const [form] = AntdForm.useForm();

  const { data: Warehouse } = useQuery({
    queryKey: ["warehouse"],
    queryFn: async () => api.get("/warehouse?sortBy=createdAt&sortOrder=DESC"),
  });

  const { data: Products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => api.get("/products?sortBy=createdAt&sortOrder=DESC"),
  });

  const { data: variant } = useQuery({
    queryKey: ["variant"],
    queryFn: async () => api.get("/variant?sortBy=createdAt&sortOrder=DESC"),
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => api.get("/companies?sortOrder=DESC"),
  });

  // from login
  const tenantId = 1;
  const createdBy = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading, handler } = useSubmit(async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("value", values);
    api
      .post("/transactions", {
        ...values,
        tenantId,
        createdBy,
      })
      .then(() => {
        form.resetFields();
        swal.success("Transaction has been succeed");
      })
      .catch(() => {
        swal.error("Something went wrong!");
      });
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Entry" breadcrumb={adminBreadcrumb} />

      <Card>
        <Title level={5}>New Stock Entry</Title>

        <AntdForm
          form={form}
          layout="vertical"
          initialValues={{ qty: 0, unit_cost: 0 }}
          onFinish={handler}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="warehouseId"
                label="Warehouse"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a brands"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={Warehouse?.data?.data?.data?.map((c: any) => ({
                    label: c.name,
                    value: Number(c.id),
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="companyId"
                label="Company"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a brands"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={companies?.data?.data?.data?.map((c: any) => ({
                    label: c.name,
                    value: Number(c.id),
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="productId"
                label="Product"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a brands"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={Products?.data?.data?.data?.map((c: any) => ({
                    label: c.name,
                    value: Number(c.id),
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="variantId"
                label="Product Variant"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a brands"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={variant?.data?.data?.data?.map((c: any) => ({
                    label: c.name,
                    value: Number(c.id),
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="transactionType"
                label="transaction Type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select product"
                  options={[
                    { label: "IN", value: "IN" },
                    { label: "OUT", value: "OUT" },
                    { label: "ADJUSTMENT", value: "ADJUSTMENT" },
                    { label: "DAMAGE", value: "DAMAGE" },
                    { label: "LOSS", value: "LOSS" },
                  ]}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="referenceType"
                label="reference Type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select product"
                  options={[
                    { label: "PURCHASE", value: "PURCHASE" },
                    { label: "SALE", value: "SALE" },
                    { label: "RETURN", value: "RETURN" },
                    { label: "TRANSFER", value: "TRANSFER" },
                    { label: "MANUAL", value: "MANUAL" },
                  ]}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="qty"
                label="Quantity"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="0" />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item name="unitCost" label="Unit Cost">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  step={0.01}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <AntdForm.Item name="referenceId" label="Reference ID">
                <Input placeholder="e.g. PO-001" />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <AntdForm.Item name="note" label="Note">
                <Input.TextArea rows={2} placeholder="Additional notes..." />
              </AntdForm.Item>
            </Col>

            <Col span={24}>
              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Record Stock Entry
                </Button>
              </div>
            </Col>
          </Row>
        </AntdForm>
      </Card>
    </div>
  );
}
