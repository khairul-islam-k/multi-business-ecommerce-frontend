"use client";

import { Form, Input, Select, Row, Col, Button, theme, message } from "antd";

import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import { useSwal } from "@/hooks/use-swal";

export default function EditWarehousePage() {
  const { id: uuid } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const swal = useSwal();

  const { data, isLoading } = useQuery({
    queryKey: ["warehouse", uuid],
    queryFn: async () => api.get(`/warehouse/${uuid}`).then((res) => res.data),
  });

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.patch(`/warehouse/${uuid}`, values);

      swal.success("Warehouse updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-warehouses"] });

      router.push("/admin/dashboard/masters/warehouses");
    } catch (err: any) {
      swal.error(err?.response?.data?.message || "Failed to update warehouse");
    }
  });

  if (isLoading) return <Loader />;

  const warehouse = data?.data ?? data;

  if (!warehouse) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Warehouse" breadcrumb={adminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        initialValues={warehouse}
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
            <Form.Item name="type" label="Type">
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
            <Form.Item name="status" label="Status">
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
            Update Warehouse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
