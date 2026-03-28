"use client"
import {
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Row,
    Col,
    Button,
    message,
    theme,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Option } = Select;

export default function CreateTenantForm() {
    const [form] = Form.useForm();
    const [fileName, setFileName] = useState("");

    const onFinish = (values: any) => {
        console.log({
            ...values,
            logo: fileName,
        });
    };

    const { token } = theme.useToken();

    return (
        <div>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title="Create" breadcrumb={superAdminBreadcrumb}></PageHeader>
            </div>

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: "100%", background: token.colorBgBase, padding: '15px', borderRadius: '8px', marginLeft: 'auto', marginRight: 'auto' }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Business Name"
                            name="businessName"
                            rules={[{ required: true, message: "Business name is required" }]}
                        >
                            <Input placeholder="Business name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Slug"
                            name="slug"
                            rules={[{ required: true, message: "Slug is required" }]}
                        >
                            <Input placeholder="Slug" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Email is required" },
                                { type: "email", message: "Invalid email" },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Phone" name="phone">
                            <Input placeholder="+880156415" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Logo">
                            <Upload
                            style={{width: '100%'}}
                                accept=".pdf,.jpg,.png"
                                beforeUpload={(file) => {
                                    if (file.size / 1024 / 1024 > 2) {
                                        message.error("File must be under 2MB");
                                        return Upload.LIST_IGNORE;
                                    }
                                    setFileName(file.name);
                                    return false;
                                }}
                                showUploadList={false}
                            >
                                <Input
                                    placeholder="Upload your file"
                                    value={fileName}
                                    readOnly
                                    suffix={<UploadOutlined />}
                                />
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            initialValue="Active"
                        >
                            <Select>
                                <Option value="Active">Active</Option>
                                <Option value="Trial">Trial</Option>
                                <Option value="Suspended">Suspended</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Trial Duration (days)"
                            name="trialDays"
                            initialValue={999}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Currency"
                            name="currency"
                            initialValue="bdt"
                        >
                            <Select>
                                <Option value="bdt">BDT</Option>
                                <Option value="usd">USD</Option>
                                <Option value="eur">EUR</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Time Zone"
                            name="timezone"
                            initialValue="utc"
                        >
                            <Select>
                                <Option value="utc">UTC</Option>
                                <Option value="est">EST</Option>
                                <Option value="pst">PST</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Tenant
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}