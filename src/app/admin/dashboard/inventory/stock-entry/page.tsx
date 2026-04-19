"use client";

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
  message,
} from "antd";
import { useRouter } from "next/navigation";
import useSubmit from "@/hooks/use-submit";

import { mockWarehouses, mockProducts } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Title } = Typography;

export default function StockEntryPage() {
  const router = useRouter();
  const swal = useSwal();
  const [form] = AntdForm.useForm();
  const { loading, handler } = useSubmit(async (values: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Stock entry recorded successfully");
    router.push("/admin/dashboard/inventory/transactions");
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
                name="warehouse_id"
                label="Warehouse"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select warehouse"
                  options={mockWarehouses.map((w) => ({
                    label: w.name,
                    value: w.id,
                  }))}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24} md={12}>
              <AntdForm.Item
                name="product_id"
                label="Product"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select product"
                  options={mockProducts.map((p) => ({
                    label: `${p.name} (${p.sku})`,
                    value: p.id,
                  }))}
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
              <AntdForm.Item name="unit_cost" label="Unit Cost">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  step={0.01}
                />
              </AntdForm.Item>
            </Col>

            <Col xs={24}>
              <AntdForm.Item name="reference_id" label="Reference ID">
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
