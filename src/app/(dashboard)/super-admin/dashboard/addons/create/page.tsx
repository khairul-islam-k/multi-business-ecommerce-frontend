"use client";

import { useRouter } from "next/navigation";
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

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreateAddon() {
  const swal = useSwal();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.post("/addons", values);

      swal.success("Addon created successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-addons"] });

      form.resetFields();
      router.push("/super-admin/dashboard/addons");
    } catch (err: any) {
      swal.error(err?.response?.data?.message || "Failed to create addon");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Addon" breadcrumb={superAdminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        onFinish={handler}
        style={{
          background: token.colorBgBase,
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Addon Name"
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
            <Form.Item name="type" label="Type" initialValue="Usage">
              <Select>
                <option value="Usage">Usage</option>
                <option value="Flat">Flat</option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="unit_price"
              label="Unit Price ($)"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="limit_key"
              label="Limit Key"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. storage-gb" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Addon
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
