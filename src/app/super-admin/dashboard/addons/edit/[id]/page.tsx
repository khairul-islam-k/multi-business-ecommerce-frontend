"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  theme,
  message,
} from "antd";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";
import { queryClient } from "@/providers/query-provider";

const { Option } = Select;

export default function EditAddon() {
  const { id: uuid } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { data, isLoading } = useQuery({
    queryKey: ["addon", uuid],
    queryFn: async () => api.get(`/addons/${uuid}`).then((res) => res.data),
  });

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.patch(`/addons/${uuid}`, values);

      message.success("Addon updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-addons"] });

      router.push("/super-admin/dashboard/addons");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to update addon");
    }
  });

  if (isLoading) return <Loader />;

  const addon = data?.data || data;

  console.log(addon);

  if (!addon) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Addon" breadcrumb={superAdminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        initialValues={addon}
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
            <Form.Item name="type" label="Type">
              <Select>
                <Option value="Usage">Usage</Option>
                <Option value="Flat">Flat</Option>
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
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Addon
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
