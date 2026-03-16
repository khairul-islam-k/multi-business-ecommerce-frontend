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
import PageHeader from "@/components/shared/page-header";

const { Option } = Select;

export default function CreatePackage() {
    const { TextArea } = Input;
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log({
            ...values,
        });
    };

    const { token } = theme.useToken();

    return (
        <div>
            <PageHeader title="Create"></PageHeader>

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: 900, background: token.colorBgBase, padding: '15px', borderRadius: '8px', marginLeft: 'auto', marginRight: 'auto' }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Package Name"
                            name="PackageName"
                            rules={[{ required: true, message: "Business name is required" }]}
                        >
                            <Input placeholder="Package Name" />
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
                            label="Monthly Price"
                            name="MonthlyPrice"
                            rules={[
                                { required: true, message: "Email is required" },
                                { type: "number", message: "provide price" },
                            ]}
                        >
                            <Input placeholder="Monthly Price ($)" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Yearly Price ($)"
                            rules={[
                                { required: true, message: "Email is required" },
                                { type: "number", message: "provide price" },
                            ]}
                            name="YearlyPrice">
                            <Input placeholder="20" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Description"
                            name='description'
                        >
                            <TextArea
                                placeholder="Package Description..."
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Type"
                            name="Type"
                            initialValue="usage"
                        >
                            <Select style={{ width: "100%" }}>
                                <Option value="usage">Usage</Option>
                                <Option value="per-unit">Per Unit</Option>
                                <Option value="flat">Flat</Option>
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
                            label="Status"
                            name="Status"
                            initialValue="active"
                        >
                            <Select
                                style={{ width: "100%" }}
                            >
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
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
                        Create Package
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}