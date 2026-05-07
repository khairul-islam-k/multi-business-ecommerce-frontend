"use client";

import { Card, Col, Flex, Row } from "antd";
import LineItemsForm from "./_components/line-items-form";
import { Form, Input, Select, DatePicker, Button } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { TextArea } = Input;

const CreatePurChaseOrder = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Create Purchase Order"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[15, 15]}>
          <Col xs={24} md={16}>
            {/* first card */}
            <Card
              style={{
                marginBottom: "10px",
              }}
            >
              <div style={{ width: "100%" }}>
                <Form.Item
                  name="supplier"
                  label="Supplier"
                  rules={[
                    { required: true, message: "Please select a supplier" },
                  ]}
                >
                  <Select placeholder="Select Supplier">
                    <option value="ABC Textile">ABC Textile</option>
                    <option value="Global Electronics">
                      Global Electronics
                    </option>
                    <option value="Pak Leather CO">Pak Leather CO</option>
                    <option value="Fashion Hub">Fashion Hub</option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ width: "100%" }}>
                <Form.Item
                  name="warehouse"
                  label="Warehouse"
                  rules={[
                    { required: true, message: "Please select a warehouse" },
                  ]}
                >
                  <Select placeholder="Select Warehouse">
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="South Warehouse">South Warehouse</option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="note" label="Note">
                <TextArea rows={4} placeholder="Enter any notes..." />
              </Form.Item>
            </Card>

            <Card>
              <LineItemsForm />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Summary">
              <Flex justify="space-between">
                <p>Subtotal</p>
                <p>Rs 2</p>
              </Flex>

              <Flex justify="space-between">
                <p>Tax (17%)</p>
                <p>Rs 2</p>
              </Flex>

              <Flex justify="space-between">
                <p>Total</p>
                <p>Rs 2</p>
              </Flex>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create Purchase Order
                </Button>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreatePurChaseOrder;
