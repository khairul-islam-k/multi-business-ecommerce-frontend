"use client";

import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Card,
  theme,
  message,
} from "antd";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreateBrandPage() {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const router = useRouter();

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.post("/brands", values);

      message.success("Brand created successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-brands"] });

      form.resetFields();
      router.push("/admin/dashboard/masters/brands");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to create brand");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Brand" breadcrumb={adminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        onFinish={handler}
        className="space-y-6"
        style={{ background: token.colorBgBase }}
      >
        {/* BASIC INFO */}
        <Card title="Basic Information" className="rounded-xl">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Brand Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Floating Cookies" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input placeholder="e.g. flo-coo" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="description" label="Description">
                <Input.TextArea
                  rows={3}
                  placeholder="Short brand description..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* STATUS */}
        <Card title="Status" className="rounded-xl">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Brand Status"
                initialValue="Active"
              >
                <Select
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ACTION */}
        <Card className="rounded-xl bg-gray-50">
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Brand
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}
