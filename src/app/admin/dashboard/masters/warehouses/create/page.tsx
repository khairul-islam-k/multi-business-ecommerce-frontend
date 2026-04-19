"use client";

import { Form, Input, Select, Row, Col, Button, theme, message } from "antd";

import { useRouter } from "next/navigation";

import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreateWarehousePage() {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const router = useRouter();

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.post("/warehouse", values);

      message.success("Warehouse created successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-warehouses"] });

      form.resetFields();
      router.push("/admin/dashboard/masters/warehouses");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to create warehouse",
      );
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Warehouse" breadcrumb={adminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        onFinish={handler}
        style={{
          background: token.colorBgBase,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Central", value: "Central" },
                  { label: "Regional", value: "Regional" },
                  { label: "Temporary", value: "Temporary" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="slug" label="Slug">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="district" label="District">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Warehouse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
