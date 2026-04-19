"use client";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  Grid,
  Select,
  Card,
  Table,
  Form,
  Input,
  Button,
  Row,
  Col,
  Flex,
} from "antd";
import React, { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { useSwal } from "@/hooks/use-swal";

interface TPage {
  id: number;
  Title: string;
  Type: string;
  Slug: string;
  SEOTitle: string;
  Status: string;
}

const data: TPage[] = [
  {
    id: 1,
    Title: "Home",
    Type: "home",
    Slug: "/",
    SEOTitle: "Main Store - Home",
    Status: "published",
  },
  {
    id: 2,
    Title: "About Us",
    Type: "page",
    Slug: "/about-us",
    SEOTitle: "Learn More About Us",
    Status: "published",
  },
  {
    id: 3,
    Title: "Contact",
    Type: "page",
    Slug: "/contact",
    SEOTitle: "Get in Touch With Us",
    Status: "published",
  },
  {
    id: 4,
    Title: "Products",
    Type: "page",
    Slug: "/products",
    SEOTitle: "Our Products Catalog",
    Status: "published",
  },
];

const { Option } = Select;

const PageBuilder = () => {
  const [filterProduct, setFilterProduct] = useState<string>("Main Store-Home");
  const screens = Grid.useBreakpoint();
  const swal = useSwal();

  const columns: ColumnsType<TPage> = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      sorter: (a: TPage, b: TPage) => a.Title.localeCompare(b.Title),
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: "Slug",
      dataIndex: "Slug",
      key: "Slug",
    },
    {
      title: "SEO Title",
      dataIndex: "SEOTitle",
      key: "SEOTitle",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    swal.success(`Page "${values.Title}" added successfully!`);
    form.resetFields();
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <PageHeader
          title="Page Builder"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <p>Manage website pages and their settings</p>

      <h3>Website</h3>
      <Select
        value={filterProduct}
        style={{
          width: screens.lg ? "200px" : "",
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

      {/* Table */}
      <Card
        style={{
          marginTop: "24px",
        }}
        title="Pages (4)"
      >
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
        </div>
      </Card>

      {/* From */}

      <Card style={{ marginTop: "24px" }} title="Add New Page">
        <Form form={form} onFinish={onFinish} style={{ width: "100%" }}>
          <Row gutter={[15, 15]} align="middle">
            <Col xs={24} md={14}>
              <h3>Page Title</h3>
              <Form.Item
                name="Title"
                rules={[{ required: true, message: "Please enter page title" }]}
              >
                <Input placeholder="Page Title" />
              </Form.Item>
            </Col>

            <Col xs={24} md={10}>
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
                  <h3>Type</h3>
                  <Form.Item
                    name="Type"
                    rules={[
                      { required: true, message: "Please select page type" },
                    ]}
                  >
                    <Select placeholder="Select Type" style={{ width: "100%" }}>
                      <Option value="home">Home</Option>
                      <Option value="page">Page</Option>
                      <Option value="product">Product</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div
                  style={{
                    width: "100%",
                  }}
                >
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

export default PageBuilder;
