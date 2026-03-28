"use client"
import {
    Form,
    Input,
    InputNumber,
    Select,
    Row,
    Col,
    Button,
    theme,
} from "antd";
import PageHeader from "@/components/shared/page-header";

type TAddonPayload = {
    addonName: string;
    limit: number;
    slug: string;
    status: string;
    type: string;
    usagePrice: number;
};

import { useParams } from "next/navigation";

const { Option } = Select;


const EditAddon = () => {
    const { id } = useParams();
    console.log(id);
    const [form] = Form.useForm();

    const onFinish = (values: TAddonPayload) => {
        console.log(values);
    };

    const { token } = theme.useToken();

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <PageHeader title="Edit Addon"></PageHeader>
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
                            label="Addon Name"
                            name="name"
                            rules={[{ required: true, message: "Addon name is required" }]}
                        >
                            <Input placeholder="Addon name" />
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
                            label="Type"
                            name="type"
                            initialValue="Usages"
                        >
                            <Select>
                                <Option value="Usages">Usages</Option>
                                <Option value="PerUnit">PerUnit</Option>
                                <Option value="Flat">Flat</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Usage Unit price ($)"
                            name="unitPrice"
                            rules={[
                                { required: true, message: "Price is required" },
                                { type: "number", message: "Invalid Price" },
                            ]}
                        >
                            <InputNumber
                            style={{width: '100%'}}
                            placeholder="15" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Limit key"
                            name="limitKey"
                            rules={[
                                { required: true, message: "limit is required" },
                                { type: "number", message: "Invalid Limit" },
                            ]}
                        >
                            <InputNumber
                            style={{width: '100%'}}
                            placeholder="Storage-gb" />
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
                                <Option value="InActive">InActive</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Addon
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditAddon;