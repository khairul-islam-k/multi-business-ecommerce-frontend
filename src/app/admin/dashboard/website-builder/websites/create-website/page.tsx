"use client";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { GlobalOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, Select, Space, theme } from 'antd';
import React from 'react';

const { Option } = Select;
const CreateWebsite = () => {
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    const onFinish = (values: any) => {
        console.log("Create Website Data:", values);
    };

    return (
        <div>
            <div style={{
                marginBottom: '24px'
            }}>
                <PageHeader title='Create Website' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>


            <Flex
                style={{
                    maxWidth: 600,
                    gap: '10px',
                    marginBottom: '24px'
                }}
            >
                <Button
                    style={{
                        background: token.colorBgBlur,
                    }}
                    icon={<GlobalOutlined />}
                    block>Manual Set up</Button>

                <Button
                    style={{
                        background: token.colorBgContainer
                    }}
                    icon={<StarOutlined />}
                    block>AI Generate</Button>
            </Flex>

            <Card
                title={
                    <Space>
                        <GlobalOutlined />
                        Create Website
                    </Space>
                }
                style={{ maxWidth: 600 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    {/* Website Name */}
                    <Form.Item
                        label="Website Name"
                        name="websiteName"
                        rules={[{ required: true, message: "Please enter website name" }]}
                    >
                        <Input placeholder="e.g. Main Store" />
                    </Form.Item>

                    {/* Slug */}
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: "Please enter slug" }]}
                    >
                        <Input placeholder="e.g. main-store" />
                    </Form.Item>

                    {/* Subdomain */}
                    <Form.Item
                        label="Subdomain"
                        name="subdomain"
                        rules={[{ required: true, message: "Please enter subdomain" }]}
                    >
                        <Input addonAfter=".yourdomain.com" placeholder="e.g. shop" />
                    </Form.Item>

                    {/* Template */}
                    <Form.Item
                        label="Template"
                        name="template"
                        rules={[{ required: true, message: "Please select a template" }]}
                    >
                        <Select placeholder="Select a template">
                            <Option value="modern-minimal-fashion">
                                Modern Minimal Fashion
                            </Option>
                            <Option value="electronics-store">
                                Electronics Store
                            </Option>
                            <Option value="grocery-basic">
                                Grocery Basic
                            </Option>
                        </Select>
                    </Form.Item>

                    {/* Buttons */}
                    <Form.Item>
                        <Space>
                            <Button onClick={() => form.resetFields()}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Website
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateWebsite;