"use client";

import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect, useMemo } from "react";

import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductVariantQuery } from "@/lib/api/hooks/product-variant";
import { useAuthStore } from "@/stores/auth.store";
import {
  SupplierProductPayload,
  SupplierProductResponse,
} from "@/types/suppliers/supplier-product";

export type SupplierProductStatus = "ACTIVE" | "INACTIVE";

type SelectOption = {
  label: string;
  value: string;
};

type SupplierProductFormValues = {
  productId: string;
  variantId?: string;
  supplierSku?: string;
  lastPurchasePrice: number;
  minOrderQuantity?: number;
  leadTimeDays?: number;
  status: SupplierProductStatus;
};

type SupplierProductFormProps = {
  initialData?: SupplierProductResponse;
  loading?: boolean;
  onSubmit: (payload: SupplierProductPayload) => void | Promise<void>;
};

export default function SupplierProductForm({
  initialData,
  loading = false,
  onSubmit,
}: SupplierProductFormProps) {
  const [form] = Form.useForm<SupplierProductFormValues>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const isUpdate = Boolean(initialData);

  const selectedProductId = Form.useWatch("productId", form);

  const { data: products, isLoading: productLoading } = useProductsQuery(
    businessId,
    {
      status: "ACTIVE",
      sortOrder: "desc",
    },
  );

  const {
    data: variants,
    isLoading: variantLoading,
    isFetching: variantFetching,
  } = useProductVariantQuery(businessId, selectedProductId || "", "");

  const productOptions: SelectOption[] = useMemo(() => {
    return (
      products?.items?.map((product) => ({
        label: product.name,
        value: product.id,
      })) ?? []
    );
  }, [products?.items]);

  const variantOptions: SelectOption[] = useMemo(() => {
    return (
      variants?.map((variant) => ({
        label: variant.title,
        value: variant.id,
      })) ?? []
    );
  }, [variants]);

  useEffect(() => {
    if (!initialData?.supplierProduct) return;

    const supplierProduct = initialData.supplierProduct;

    form.setFieldsValue({
      productId: supplierProduct.productId,
      variantId: supplierProduct.variantId ?? undefined,
      supplierSku: supplierProduct.supplierSku ?? undefined,
      lastPurchasePrice: Number(supplierProduct.lastPurchasePrice),
      minOrderQuantity: supplierProduct.minOrderQuantity ?? undefined,
      leadTimeDays: supplierProduct.leadTimeDays ?? undefined,
      status: supplierProduct.status,
    });
  }, [initialData, form]);

  const handleFinish = async (values: SupplierProductFormValues) => {
    const payload: SupplierProductPayload = {
      productId: values.productId,
      variantId: values.variantId || null,
      supplierSku: values.supplierSku?.trim() || undefined,
      lastPurchasePrice: values.lastPurchasePrice,
      minOrderQuantity: values.minOrderQuantity ?? null,
      leadTimeDays: values.leadTimeDays ?? null,
      status: values.status,
    };

    await onSubmit(payload);
  };

  return (
    <Card
      title={isUpdate ? "Update Supplier Product" : "Create Supplier Product"}
    >
      <Form<SupplierProductFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          status: "ACTIVE",
          minOrderQuantity: 1,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Product"
              name="productId"
              rules={[{ required: true, message: "Please select product" }]}
            >
              <Select
                showSearch
                allowClear
                loading={productLoading}
                placeholder="Search and select product"
                optionFilterProp="label"
                options={productOptions}
                onChange={() => {
                  form.setFieldValue("variantId", undefined);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Variant" name="variantId">
              <Select
                showSearch
                allowClear
                disabled={!selectedProductId}
                loading={variantLoading || variantFetching}
                placeholder={
                  selectedProductId
                    ? "Search and select variant"
                    : "Select product first"
                }
                optionFilterProp="label"
                options={variantOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Supplier SKU" name="supplierSku">
              <Input placeholder="SUP-SKU-01" maxLength={100} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Last Purchase Price" name="lastPurchasePrice">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="100"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Minimum Order Quantity" name="minOrderQuantity">
              <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Lead Time Days" name="leadTimeDays">
              <InputNumber min={0} style={{ width: "100%" }} placeholder="7" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Status" name="status">
              <Select
                placeholder="Select status"
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isUpdate ? "Update Supplier Product" : "Create Supplier Product"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
