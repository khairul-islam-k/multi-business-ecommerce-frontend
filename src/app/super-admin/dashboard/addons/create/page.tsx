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
  message,
} from "antd";

import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Option } = Select;

export default function CreateAddon() {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Addon updated!");
  });

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Create Addon"
          breadcrumb={superAdminBreadcrumb}
        ></PageHeader>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => handler(values)}
        style={{
          maxWidth: "100%",
          background: token.colorBgBase,
          padding: "15px",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Addon Name"
              name="name"
              rules={[{ required: true, message: "Addon name is required" }]}
            >
              <Input placeholder="Addon name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: "Slug is required" }]}
            >
              <Input placeholder="Slug" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Type" name="type" initialValue="Usages">
              <Select>
                <Option value="Usages">Usages</Option>
                <Option value="PerUnit">PerUnit</Option>
                <Option value="Flat">Flat</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Usage Unit price ($)"
              name="unitPrice"
              rules={[
                { required: true, message: "Price is required" },
                { type: "number", message: "Invalid Price" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="15" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Limit key"
              name="limitKey"
              rules={[{ required: true, message: "limit is required" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="storage-gb" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Status" name="status" initialValue="Active">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="InActive">InActive</Option>
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
