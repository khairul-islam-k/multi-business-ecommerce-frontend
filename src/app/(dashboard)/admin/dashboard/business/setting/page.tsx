"use client";

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

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

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
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BDT">BDT</option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Date Format"
                name="dateFormat"
                rules={[{ required: true, message: "Select date format" }]}
              >
                <Select placeholder="Select date format">
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Time Zone"
                name="timeZone"
                rules={[{ required: true, message: "Select time zone" }]}
              >
                <Select placeholder="Select time zone">
                  <option value="Asia/Dhaka">Asia/Dhaka</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Europe/London">Europe/London</option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Language"
                name="language"
                rules={[{ required: true, message: "Select language" }]}
              >
                <Select placeholder="Select language">
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                  <option value="hi">Hindi</option>
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
                  <option value="main">Main Warehouse</option>
                  <option value="secondary">Secondary Warehouse</option>
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
