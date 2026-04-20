"use client";

import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  theme,
} from "antd";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

export default function CreatePackage() {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const router = useRouter();
  const swal = useSwal();

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.post("/packages", {
        name: values.name,
        slug: values.slug,
        description: values.description,
        type: values.type,
        status: values.status,
        monthly_price: values.monthly_price,
        yearly_price: values.yearly_price,
      });

      swal.success("Package created successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-packages"] });

      form.resetFields();
      router.push("/super-admin/dashboard/packages");
    } catch (err: any) {
      swal.error(err?.response?.data?.message || "Failed to create package");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Package" breadcrumb={superAdminBreadcrumb} />

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
            <Form.Item
              name="name"
              label="Package Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="monthly_price"
              label="Monthly Price"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="yearly_price" label="Yearly Price">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} maxLength={200} />
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
            <Form.Item name="type" label="Type" initialValue="Monthly">
              <Select
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Yearly", value: "Yearly" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
