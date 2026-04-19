"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { Form, Input, InputNumber, Select, DatePicker, Switch, Button, message, Card } from "antd";
import { useRouter } from "next/navigation";

const { TextArea } = Input;
const { Option } = Select;

export default function ProductCreatePage() {
    const [form] = Form.useForm();
    const user = useAuthStore((state) => state.user);

    const onFinish = (values: any) => {
        // Format date
        if (values.published_at) {
            values.published_at = values.published_at.format("YYYY-MM-DD HH:mm:ss");
        }

        console.log("Product data:", values);

        api.post('/products', values)
        .then(res => {
            console.log(res.data.data)
        })
    };

    const router = useRouter();

    return (
        <div style={{ padding: 24 }}>
            <div style={{marginBottom: '24px'}}>
                <PageHeader title="New Product" breadcrumb={adminBreadcrumb}></PageHeader>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        tenant_id: 101,
                        company_id: 1001,
                        status: "Active",
                        is_featured: false,
                    }}
                >
                    <Form.Item label="Tenant ID" name="tenant_id" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Company ID" name="company_id" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Brand ID" name="brand_id">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Category ID" name="category_id" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Barcode" name="barcode">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Short Description" name="short_description" rules={[{ required: true }]}>
                        <TextArea rows={2} />
                    </Form.Item>

                    <Form.Item label="Long Description" name="long_description" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item label="Cost Price" name="cost_price" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Sale Price" name="sale_price" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Compare Price" name="compare_price">
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Tax Type" name="tax_type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="VAT">VAT</Option>
                            <Option value="GST">GST</Option>
                            <Option value="None">None</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Tax Amount" name="tax_amount">
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Weight (kg)" name="weight">
                        <InputNumber min={0} style={{ width: "100%" }} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Featured" name="is_featured" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Published At" name="published_at">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                        style={{ marginRight: 8 }}
                        type="primary" htmlType="submit">
                            Create Product
                        </Button>
                        <Button
                        onClick={() => router.push("/admin/dashboard/products-management/products")}
                        htmlType="button">
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    );
}