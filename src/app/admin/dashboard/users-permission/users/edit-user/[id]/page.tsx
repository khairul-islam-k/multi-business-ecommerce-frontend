"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
    Form,
    Input,
    Select,
    Card,
    Row,
    Col,
    Button,
} from "antd";
import { useEffect } from "react";

const { Option } = Select;
const { TextArea } = Input;

export default function EditUserPage() {
    const [form] = Form.useForm();

    // 👉 Mock API data
    const user = {
        tenant_id: 'sjdflk',
        company_id: 2,
        name: "Rahim Uddin",
        email: "rahim.uddin@example.com",
        phone: "+8801712345678",
        avatar: "https://example.com/avatar.png",
        status: "active",

        gender: "male",
        date_of_birth: "1995-06-12", // ISO format
        address: "Dhanmondi",
        city: "Dhaka",
        state: "Dhaka",
        postal_code: "1209",
        country: "Bangladesh",
        emergency_contact: "+8801912345678",
        notes: "Key account user",
    };

    useEffect(() => {
        form.setFieldsValue(user);
    }, [form]);

    const onFinish = (values: any) => {
        console.log("Update Payload:", values);
        // values.date_of_birth is already "YYYY-MM-DD"
    };

    return (
        <div>

            <div style={{marginBottom: "24px"}}>
                <PageHeader title='Edit user' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    {/* ================= Card 1 ================= */}
                    <Col xs={24} md={12}>
                        <Card title="User Account Information">
                            <Form.Item label="Tenant ID" name="tenant_id">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Company ID" name="company_id">
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: "email" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="Avatar URL" name="avatar">
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                    <Option value="suspended">Suspended</Option>
                                </Select>
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* ================= Card 2 ================= */}
                    <Col xs={24} md={12}>
                        <Card title="User Profile Details">
                            <Form.Item label="Gender" name="gender">
                                <Select allowClear>
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>
                            </Form.Item>

                            {/* ✅ Native date input */}
                            <Form.Item label="Date of Birth" name="date_of_birth">
                                <Input type="date" />
                            </Form.Item>

                            <Form.Item label="Address" name="address">
                                <TextArea rows={2} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="City" name="city">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="State" name="state">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Postal Code" name="postal_code">
                                        <Input />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Country" name="country">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Emergency Contact" name="emergency_contact">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Notes" name="notes">
                                <TextArea rows={3} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Update User
                    </Button>
                </div>
            </Form>
        </div>
    );
}