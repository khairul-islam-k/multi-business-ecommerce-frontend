"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  Card,
  Form,
  Select,
  Row,
  Col,
  Input,
  InputNumber,
  Switch,
  Button,
  Flex,
} from "antd";

const { Option } = Select;

export default function SystemSettingsForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Settings:", values);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Business Settings"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* ================= Card 1 ================= */}
          <Col xs={24} md={12}>
            <Card title="Regional Settings">
              <Form.Item
                label="Default Currency"
                name="currency"
                rules={[{ required: true, message: "Select currency" }]}
              >
                <Select placeholder="Select currency">
                  <Option value="BDT">BDT</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                  <Option value="BDT">BDT</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Date Format"
                name="dateFormat"
                rules={[{ required: true, message: "Select date format" }]}
              >
                <Select placeholder="Select date format">
                  <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                  <Option value="MM-DD-YYYY">MM-DD-YYYY</Option>
                  <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Time Zone"
                name="timeZone"
                rules={[{ required: true, message: "Select time zone" }]}
              >
                <Select placeholder="Select time zone">
                  <Option value="Asia/Dhaka">Asia/Dhaka</Option>
                  <Option value="UTC">UTC</Option>
                  <Option value="Asia/Kolkata">Asia/Kolkata</Option>
                  <Option value="Europe/London">Europe/London</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Language"
                name="language"
                rules={[{ required: true, message: "Select language" }]}
              >
                <Select placeholder="Select language">
                  <Option value="en">English</Option>
                  <Option value="bn">বাংলা</Option>
                  <Option value="hi">Hindi</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* ================= Card 2 ================= */}
          <Col xs={24} md={12}>
            <Card title="Defaults & Prefixes">
              <Flex style={{ width: "100%", gap: "4px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Order Prefix"
                    name="orderPrefix"
                    rules={[{ required: true, message: "Enter order prefix" }]}
                  >
                    <Input placeholder="ORD-" />
                  </Form.Item>
                </div>

                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Invoice Prefix"
                    name="invoicePrefix"
                    rules={[
                      { required: true, message: "Enter invoice prefix" },
                    ]}
                  >
                    <Input placeholder="INV-" />
                  </Form.Item>
                </div>
              </Flex>

              <Form.Item
                label="Default Warehouse"
                name="warehouse"
                rules={[{ required: true, message: "Select warehouse" }]}
              >
                <Select placeholder="Select warehouse">
                  <Option value="main">Main Warehouse</Option>
                  <Option value="secondary">Secondary Warehouse</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Default Tax Rate (%)"
                name="taxRate"
                rules={[{ required: true, message: "Enter tax rate" }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  placeholder="e.g. 15"
                />
              </Form.Item>

              <Form.Item
                label="Auto Invoice Generation"
                name="autoInvoice"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Save Settings
          </Button>
        </div>
      </Form>
    </div>
  );
}
