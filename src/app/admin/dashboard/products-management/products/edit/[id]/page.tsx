"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
} from "antd";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import api from "@/lib/axios";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;

export default function ProductEditPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  /* ---------------- Fetch Product ---------------- */
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => api.get(`/products/${id}`),
  });

  // companies
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


  /* ---------------- Set Form Values (IMPORTANT) ---------------- */
  useEffect(() => {
    if (product?.data?.data) {
      form.setFieldsValue(product.data.data);
    }
  }, [product, form]);

  /* ---------------- Submit ---------------- */
  const onFinish = (values: any) => {
    try {
      api.patch(`/products/${id}`, {...values, tenant_id: 1})
        .then(res => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });
          router.push("/admin/dashboard/products-management/products");
        })
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Edit Product" breadcrumb={adminBreadcrumb} />

      <Card style={{ marginTop: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
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
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="is_featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Update Product
            </Button>
            <Button onClick={() => router.back()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}