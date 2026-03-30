"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
    Form,
    Input,
    Select,
    DatePicker,
    Card,
    Row,
    Col,
    Button,
    InputNumber,
} from "antd";

const { Option } = Select;
const { TextArea } = Input;

const CreateUser = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Create User Payload:", values);
    };

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Create User' breadcrumb={adminBreadcrumb}></PageHeader>
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
                                <Input placeholder="Tenant ID (optional)" />
                            </Form.Item>

                            <Form.Item label="Company ID" name="company_id">
                                <Input placeholder="Company ID (optional)" />
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: "Enter name" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Enter email" },
                                    { type: "email", message: "Invalid email" },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    { required: true, message: "Enter phone" },
                                    { type: "number", message: "Invalid number" },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Enter password" }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item label="Avatar URL" name="avatar">
                                <Input placeholder="https://example.com/avatar.png" />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                                initialValue="active"
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
                                <Select placeholder="Select gender">
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Date of Birth" name="date_of_birth">
                                <DatePicker style={{ width: "100%" }} />
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

                            <Form.Item label="Emergency Contact"
                                rules={[
                                    { required: true, message: "Enter email" },
                                    { type: "number", message: "Invalid number" },
                                ]}
                                name="emergency_contact">
                                <InputNumber style={{ width: '100%' }} placeholder="Name & phone" />
                            </Form.Item>

                            <Form.Item label="Notes" name="notes">
                                <TextArea rows={3} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                {/* ================= Actions ================= */}
                <div style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Create User
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateUser;