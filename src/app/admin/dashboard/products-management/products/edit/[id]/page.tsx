"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Button,
  message,
  Card,
} from "antd";
import { useParams, useRouter } from "next/navigation";

const { TextArea } = Input;
const { Option } = Select;

export default function ProductEditPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams();
  const swal = useSwal();

  // Example product data
  const productData = {
    id: 3,
    tenant_id: 101,
    company_id: 1001,
    brand_id: 502,
    category_id: 203,
    name: "USB-C Charger",
    slug: "usb-c-charger",
    sku: "UC-003",
    barcode: "9876543210987",
    short_description: "Fast charging USB-C adapter",
    long_description:
      "High-speed USB-C charger compatible with multiple devices.",
    cost_price: 10.0,
    sale_price: 18.0,
    compare_price: 20.0,
    tax_type: "VAT",
    tax_amount: 1.5,
    weight: 0.1,
    status: "Inactive",
    is_featured: false,
    published_at: null,
  };

  const onFinish = (values: any) => {
    // Convert Date object to ISO string if published_at exists
    if (values.published_at) {
      values.published_at = values.published_at.toISOString(); // "2025-03-20T10:00:00.000Z"
    }

    console.log("Updated product data:", values);
    swal.success("Product updated successfully!");
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <PageHeader title="Edit Product" breadcrumb={adminBreadcrumb} />
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ...productData,
            // Convert string to Date object for DatePicker
            published_at: productData.published_at
              ? new Date(productData.published_at)
              : null,
          }}
        >
          <Form.Item
            label="Tenant ID"
            name="tenant_id"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Company ID"
            name="company_id"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Brand ID" name="brand_id">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Category ID"
            name="category_id"
            rules={[{ required: true }]}
          >
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

          <Form.Item
            label="Short Description"
            name="short_description"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Long Description"
            name="long_description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Cost Price"
            name="cost_price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Sale Price"
            name="sale_price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Compare Price" name="compare_price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Tax Type"
            name="tax_type"
            rules={[{ required: true }]}
          >
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

          <Form.Item
            label="Featured"
            name="is_featured"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Published At" name="published_at">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              value={form.getFieldValue("published_at")}
              onChange={(date) =>
                form.setFieldsValue({
                  published_at: date ? date.toDate() : null,
                })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button style={{ marginRight: 8 }} type="primary" htmlType="submit">
              update Product
            </Button>
            <Button
              onClick={() =>
                router.push("/admin/dashboard/products-management/products")
              }
              htmlType="button"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
