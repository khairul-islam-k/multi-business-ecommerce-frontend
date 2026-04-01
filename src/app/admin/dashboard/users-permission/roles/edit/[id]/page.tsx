"use client";

import React, { useEffect } from "react";
import { Form, Input, Switch, Button, Card, Row, Col, Typography, Space } from "antd";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

type Role = {
    name: string;
    slug: string;
    description: string;
    is_system_role: boolean;
};

const roleData = {
    name: "Admin",
    slug: "admin",
    description: "Full system access",
    is_system_role: true,
};


const EditRole = () => {


    const [form] = Form.useForm();
    const router = useRouter();

    // Auto-fill form with existing role values
    useEffect(() => {
        form.setFieldsValue(roleData);
    }, [form]);

    // Auto-generate slug when name changes
    const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const slug = value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        form.setFieldsValue({ slug });
    };

    const onFinish = (values: Role) => {
        console.log("Updated Role:", values);
        // Here you can call your API to update the role
    };

    return (
        <div>

            <div style={{ marginBottom: '24px' }}>
                <PageHeader title='Edit Role' breadcrumb={adminBreadcrumb}></PageHeader>
            </div>
            <p>Update the details for </p>

            <Card title="Edit Role" style={{ maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ ...roleData }}
                >
                    {/* Role Name */}
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[{ required: true, message: "Role name is required" }]}
                    >
                        <Input placeholder="Enter role name" onChange={handleRoleNameChange} />
                    </Form.Item>

                    {/* Slug */}
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: "Slug is required" }]}
                    >
                        <Input placeholder="Enter slug" />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter description"
                        />
                    </Form.Item>

                    {/* System Role Switch */}
                    <Form.Item
                        name="is_system_role"
                        valuePropName="checked"
                    >
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Text strong>System Role</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    System roles cannot be deleted or modified
                                </Text>
                            </Col>
                            <Col>
                                <Switch />
                            </Col>
                        </Row>
                    </Form.Item>

                    {/* Actions */}
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Update Role
                            </Button>
                            <Button htmlType="button" onClick={() => router.push("/admin/dashboard/users-permission/roles")}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditRole;