"use client";

import React from "react";
import { Form, Input, Switch, Button, Card, Row, Col, Typography } from "antd";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

const CreateRoleForm: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    // Auto-generate slug from role name
    // const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     const slug = value
    //         .toLowerCase()
    //         .trim()
    //         .replace(/\s+/g, "-")
    //         .replace(/[^a-z0-9-]/g, "");

    //     form.setFieldsValue({ slug });
    // };

    const onFinish = (values: any) => {
        console.log("Role Data:", values);
    };

    return (
        <div>

            <div style={{marginBottom: '24px'}}>
                <PageHeader title='Create New Role' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Define a new role and its basic properties.</p>

            <Card title="Create Role" style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        is_system_role: false,
                    }}
                >
                    {/* Role Name */}
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[{ required: true, message: "Role name is required" }]}
                    >
                        <Input
                            placeholder="e.g. Admin"
                        // onChange={handleRoleNameChange}
                        />
                    </Form.Item>

                    {/* Slug */}
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: "Slug is required" }]}
                    >
                        <Input placeholder="e.g. admin" />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Short description about this role"
                        />
                    </Form.Item>

                    {/* System Role Switch */}
                    <Card style={{ marginBottom: '8px' }}>
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Text strong>System Role</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    System roles cannot be deleted or modified
                                </Text>
                            </Col>

                            <Col>
                                <Form.Item
                                    name="is_system_role"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Actions */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Create Role
                        </Button>
                        <Button htmlType="button" onClick={() => router.push("/admin/dashboard/users-permission/roles")}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateRoleForm;