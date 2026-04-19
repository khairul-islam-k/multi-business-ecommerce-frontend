"use client";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import React, { useState } from "react";
import MainNavigation from "./_components/MainNavigation";
import { Button, Card, Col, Flex, Form, Grid, Input, Row, Select } from "antd";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

const MenuBuilder = () => {
  const [form] = Form.useForm();
  const [filterProduct, setFilterProduct] = useState<string>("Main Store-Home");
  const screens = Grid.useBreakpoint();
  const swal = useSwal();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    swal.success(`Page "${values.Title}" added successfully!`);
    form.resetFields();
  };

  return (
    <div>
      <div>
        <PageHeader
          title="Menu Builder"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Configure website navigation menus</p>

      {/* menu select */}
      {/* filter */}
      <Select
        value={filterProduct}
        style={{
          width: screens.lg ? "250px" : "",
          marginBottom: "15px",
        }}
        onChange={setFilterProduct}
      >
        <Option value="Main Store-Home">Main Store-Home</Option>
        <Option value="Main Store-About Us">Main Store-About Us</Option>
        <Option value="Main Store-contact">Main Store-contact</Option>
        <Option value="Main Store Product">Main Store Product</Option>
        <Option value="Fashion Hub-Home">Fashion Hub-Home</Option>
        <Option value="Tech Outlet-Home">Tech Outlet-Home</Option>
      </Select>

      <MainNavigation />

      {/* form */}
      <Card style={{ marginTop: "24px" }} title="Add New Page">
        <Form form={form} onFinish={onFinish} style={{ width: "100%" }}>
          <Row gutter={[15, 15]} align="middle">
            {/* Label */}
            <Col xs={24} md={8}>
              <h3>Label</h3>
              <Form.Item
                name="label"
                rules={[{ required: true, message: "Please enter page title" }]}
              >
                <Input placeholder="Page Title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <h3>URL</h3>
              <Form.Item
                name="URL"
                rules={[{ required: true, message: "Please enter page title" }]}
              >
                <Input placeholder="Page Title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Flex
                style={{
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <h3>.</h3>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Add Page
                    </Button>
                  </Form.Item>
                </div>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default MenuBuilder;
