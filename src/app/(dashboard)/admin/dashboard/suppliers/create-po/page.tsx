"use client";
import { Card, Col, Flex, Grid, Row } from 'antd';
import React from 'react';
import LineItemsForm from './_components/LineItemsForm';
import { Form, Input, Select, DatePicker, Button } from "antd";
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const { TextArea } = Input;
const { Option } = Select;

const CreatePurChaseOrder = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Form Values:", values);
    };

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Create Purchase Order' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={[15, 15]}>
                    <Col xs={24} md={16} >
                        {/* first card */}
                        <Card style={{
                            marginBottom: '10px'
                        }}>

                            <div style={{ width: '100%' }}>
                                <Form.Item
                                    name="supplier"
                                    label="Supplier"
                                    rules={[{ required: true, message: "Please select a supplier" }]}
                                >
                                    <Select placeholder="Select Supplier">
                                        <Option value="ABC Textile">ABC Textile</Option>
                                        <Option value="Global Electronics">Global Electronics</Option>
                                        <Option value="Pak Leather CO">Pak Leather CO</Option>
                                        <Option value="Fashion Hub">Fashion Hub</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <div style={{ width: '100%' }}>
                                <Form.Item
                                    name="warehouse"
                                    label="Warehouse"
                                    rules={[{ required: true, message: "Please select a warehouse" }]}
                                >
                                    <Select placeholder="Select Warehouse">
                                        <Option value="Main Warehouse">Main Warehouse</Option>
                                        <Option value="South Warehouse">South Warehouse</Option>
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

                            <Form.Item
                                name="note"
                                label="Note"
                            >
                                <TextArea rows={4} placeholder="Enter any notes..." />
                            </Form.Item>


                        </Card>

                        <Card>
                            <LineItemsForm />
                        </Card>

                    </Col>

                    <Col xs={24} md={8}>
                        <Card title='Summary'>
                            <Flex justify='space-between'>
                                <p>Subtotal</p>
                                <p>Rs 2</p>
                            </Flex>

                            
                            <Flex justify='space-between'>
                                <p>Tax (17%)</p>
                                <p>Rs 2</p>
                            </Flex>

                            <Flex justify='space-between'>
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