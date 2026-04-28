"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { Form, Input, InputNumber, Select, DatePicker, Switch, Button, message, Card } from "antd";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;

export default function ProductCreatePage() {
  const [form] = Form.useForm();
  const user = useAuthStore((state) => state.user);

  // then fix
  const tenant_id = 1;

  // company
  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => api.get("/companies?sortOrder=DESC"),
  });

  // brands
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => api.get("/brands?sortOrder=DESC"),
  });

  // category
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => api.get("/categories"),
  });

  console.log('category', categories?.data?.data?.data);

  const onFinish = (values: any) => {
    // Format date
    const newData = {
      ...values,
      tenant_id
    }

    // post data
    api.post('/products', newData)
      .then(res => {
        form.resetFields();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      })

  };

  const router = useRouter();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="New Product"
          breadcrumb={adminBreadcrumb}
        ></PageHeader>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            tenant_id: 101,
            status: "Active",
            is_featured: false,
          }}
        >

          <Form.Item
            label="Company"
            name="company_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a company"
              options={companies?.data?.data?.data?.map((c: any) => ({
                label: c.name,
                value: Number(c.id),
              }))}
            />
          </Form.Item>

          <Form.Item label="Brands" name="brand_id">
            <Select
              placeholder="Select a brands"
              options={brands?.data?.data?.data?.map((c: any) => ({
                label: c.name,
                value: Number(c.id),
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a categories"
              options={categories?.data?.data?.data?.map((c: any) => ({
                label: c.name,
                value: Number(c.id),
              }))}
            />
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

          <Form.Item>
            <Button style={{ marginRight: 8 }} type="primary" htmlType="submit">
              Create Product
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
