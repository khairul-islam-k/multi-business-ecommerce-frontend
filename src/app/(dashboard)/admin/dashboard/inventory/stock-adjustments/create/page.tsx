"use client";

import {
  CirclePlus,
  Save,
  Trash2
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductVariantQuery } from "@/lib/api/hooks/product-variant";
import { useStockAdjustmentMutation } from "@/lib/api/hooks/stock-adjustment";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { StockAdjustmentPayload } from "@/types/stock/adjustment";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import type { FormInstance } from "antd";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type VariantSelectProps = {
  businessId: string;
  productId?: string;
  fieldName: number;
};

const VariantSelect = ({
  businessId,
  productId,
  fieldName,
}: VariantSelectProps) => {
  const {
    data: variants,
    isLoading,
    isFetching,
  } = useProductVariantQuery(businessId, productId ?? "", "");

  const variantOptions: SelectOption[] = useMemo(() => {
    return (
      variants?.map((variant) => ({
        label: variant.title || "Untitled Variant",
        value: variant.id,
      })) ?? []
    );
  }, [variants]);

  return (
    <Form.Item label="Variant" name={[fieldName, "variantId"]}>
      <Select
        allowClear
        showSearch
        disabled={!productId}
        loading={isLoading || isFetching}
        placeholder={productId ? "Select variant optional" : "Select product first"}
        optionFilterProp="label"
        options={variantOptions}
      />
    </Form.Item>
  );
};

type StockAdjustmentItemRowProps = {
  businessId: string;
  form: FormInstance<StockAdjustmentPayload>;
  fieldName: number;
  productOptions: SelectOption[];
  productLoading: boolean;
};

const StockAdjustmentItemRow = ({
  businessId,
  form,
  fieldName,
  productOptions,
  productLoading,
}: StockAdjustmentItemRowProps) => {
  const selectedProductId = Form.useWatch(
    ["items", fieldName, "productId"],
    form,
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Form.Item
        label="Product"
        name={[fieldName, "productId"]}
        rules={[{ required: true, message: "Please select product" }]}
      >
        <Select
          allowClear
          showSearch
          loading={productLoading}
          placeholder="Select product"
          optionFilterProp="label"
          options={productOptions}
          onChange={() => {
            form.setFieldValue(["items", fieldName, "variantId"], undefined);
          }}
        />
      </Form.Item>

      <VariantSelect
        businessId={businessId}
        productId={selectedProductId}
        fieldName={fieldName}
      />

      <Form.Item
        label="Adjustment Qty"
        name={[fieldName, "adjustmentQty"]}
        rules={[
          { required: true, message: "Please enter quantity" },
          {
            validator: (_, value) => {
              if (!value || Number(value) <= 0) {
                return Promise.reject("Quantity must be greater than 0");
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber min={1} style={{ width: "100%" }} placeholder="3" />
      </Form.Item>

      <Form.Item
        label="Item Reason"
        name={[fieldName, "reason"]}
        className="md:col-span-4"
      >
        <Input.TextArea rows={3} placeholder="Opening stock" />
      </Form.Item>
    </div>
  );
};

export default function CreateStockAdjustmentPage() {
  const [form] = Form.useForm<StockAdjustmentPayload>();
  const swal = useSwal();
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const {
    data: warehouses,
    isLoading: warehouseLoading,
    isFetching: warehouseFetching,
  } = useWarehousesQuery(businessId, {
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const {
    data: products,
    isLoading: productLoading,
    isFetching: productFetching,
  } = useProductsQuery(businessId, {
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const warehouseOptions: SelectOption[] = useMemo(() => {
    return (
      warehouses?.items?.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
      })) ?? []
    );
  }, [warehouses?.items]);

  const productOptions: SelectOption[] = useMemo(() => {
    return (
      products?.items?.map((product) => ({
        label: product.name,
        value: product.id,
      })) ?? []
    );
  }, [products?.items]);

  const adjustmentTypeOptions: SelectOption[] = useMemo(
    () => [
      { label: "Increase", value: "INCREASE" },
      { label: "Decrease", value: "DECREASE" },
    ],
    [],
  );

  const { createStockAdjustment } = useStockAdjustmentMutation(businessId);

  const handleSubmit = async (values: StockAdjustmentPayload) => {
    const payload = {
      warehouseId: values.warehouseId,
      adjustmentType: values.adjustmentType,
      reason: values.reason?.trim() || "",
      items: values.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || "",
        adjustmentQty: Number(item.adjustmentQty),
        reason: item.reason?.trim() || "",
      })),
    };

    console.log("stock adjustment payload", payload);

    try {
      await createStockAdjustment.mutateAsync(payload);

      swal.success("Stock adjustment created successfully.");

      form.resetFields();

      // optional redirect
      router.push("/admin/dashboard/inventory/stock-adjustments");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Stock Adjustment"
        subtitle="Create stock increase or decrease adjustments for warehouse inventory with product, variant, quantity, and reason details."
        breadcrumb={adminBreadcrumb}
      />
      
      <Card title="Create Stock Adjustment">
        <Form<StockAdjustmentPayload>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            adjustmentType: "INCREASE",
            items: [
              {
                productId: undefined,
                variantId: undefined,
                adjustmentQty: 3,
              },
            ],
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Warehouse"
              name="warehouseId"
              rules={[{ required: true, message: "Please select warehouse" }]}
            >
              <Select
                allowClear
                showSearch
                loading={warehouseLoading || warehouseFetching}
                placeholder="Select warehouse"
                optionFilterProp="label"
                options={warehouseOptions}
              />
            </Form.Item>

            <Form.Item
              label="Adjustment Type"
              name="adjustmentType"
              rules={[
                { required: true, message: "Please select adjustment type" },
              ]}
            >
              <Select
                placeholder="Select adjustment type"
                options={adjustmentTypeOptions}
              />
            </Form.Item>
          </div>

          <Form.Item label="Reason" name="reason">
            <Input.TextArea rows={3} placeholder="Cycle count correction" />
          </Form.Item>

          <Card size="small" title="Adjustment Items">
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <Card
                      key={field.key}
                      size="small"
                      type="inner"
                      title={`Item ${field.name + 1}`}
                      extra={
                        fields.length > 1 ? (
                          <Button
                            danger
                            size="small"
                            icon={<Trash2 />}
                            onClick={() => remove(field.name)}
                          >
                            Remove
                          </Button>
                        ) : null
                      }
                    >
                      <StockAdjustmentItemRow
                        businessId={businessId}
                        form={form}
                        fieldName={field.name}
                        productOptions={productOptions}
                        productLoading={productLoading || productFetching}
                      />
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    icon={<CirclePlus />}
                    onClick={() =>
                      add({
                        productId: undefined,
                        variantId: undefined,
                        adjustmentQty: 1,
                        reason: "Opening stock",
                      })
                    }
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </Form.List>
          </Card>

          <Space className="mt-4">
            <Button type="primary" htmlType="submit" icon={<Save />}>
              Create Adjustment
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}