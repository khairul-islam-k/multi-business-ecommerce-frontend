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
import { useStockTransferMutation } from "@/lib/api/hooks/stock-transfer";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { StockTransferPayload } from "@/types/stock/stock-tansfer";
import {
  Button,
  Card,
  Form as AntdForm,
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
    const variantItems = Array.isArray(variants)
      ? variants
      : variants ?? [];

    return variantItems.map((variant) => ({
      label: variant.title || "Untitled Variant",
      value: variant.id,
    }));
  }, [variants]);

  return (
    <AntdForm.Item label="Variant" name={[fieldName, "variantId"]}>
      <Select
        allowClear
        showSearch
        disabled={!productId}
        loading={isLoading || isFetching}
        placeholder={productId ? "Select variant" : "Select product first"}
        optionFilterProp="label"
        options={variantOptions}
      />
    </AntdForm.Item>
  );
};

type StockTransferItemRowProps = {
  businessId: string;
  form: FormInstance<StockTransferPayload>;
  fieldName: number;
  productOptions: SelectOption[];
  productLoading: boolean;
};

const StockTransferItemRow = ({
  businessId,
  form,
  fieldName,
  productOptions,
  productLoading,
}: StockTransferItemRowProps) => {
  const selectedProductId = AntdForm.useWatch(
    ["items", fieldName, "productId"],
    form,
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <AntdForm.Item
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
      </AntdForm.Item>

      <VariantSelect
        businessId={businessId}
        productId={selectedProductId}
        fieldName={fieldName}
      />

      <AntdForm.Item
        label="Requested Quantity"
        name={[fieldName, "requestedQuantity"]}
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
        <InputNumber
          style={{
            width: '100%'
          }}
          min={1} className="w-full" placeholder="3" />
      </AntdForm.Item>
    </div>
  );
};

export default function CreateStockTransferPage() {
  const router = useRouter();
  const swal = useSwal();
  const [form] = AntdForm.useForm<StockTransferPayload>();

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

  const { createStockTransfer } = useStockTransferMutation(businessId);

  const handleSubmit = async (values: StockTransferPayload) => {
    const payload = {
      fromWarehouseId: values.fromWarehouseId,
      toWarehouseId: values.toWarehouseId,
      note: values.note?.trim() || "",
      items: values.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || "",
        requestedQuantity: Number(item.requestedQuantity),
      })),
    };

    try {
      const res = await createStockTransfer.mutateAsync(payload);
      console.log('res', res);
      swal.success("Stock transfer created successfully.");
      form.resetFields();

      router.push("/admin/dashboard/inventory/stock-transfers");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Stock Transfer"
        subtitle="Transfer stock from one warehouse to another with product, variant, and requested quantity details."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <AntdForm<StockTransferPayload>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            items: [
              {
                productId: undefined,
                variantId: undefined,
                requestedQuantity: 3,
              },
            ],
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AntdForm.Item
              label="From Warehouse"
              name="fromWarehouseId"
              rules={[
                { required: true, message: "Please select from warehouse" },
              ]}
            >
              <Select
                allowClear
                showSearch
                loading={warehouseLoading || warehouseFetching}
                placeholder="Select from warehouse"
                optionFilterProp="label"
                options={warehouseOptions}
              />
            </AntdForm.Item>

            <AntdForm.Item
              label="To Warehouse"
              name="toWarehouseId"
              dependencies={["fromWarehouseId"]}
              rules={[
                { required: true, message: "Please select to warehouse" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const fromWarehouseId = getFieldValue("fromWarehouseId");

                    if (!value || value !== fromWarehouseId) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      "From warehouse and to warehouse cannot be same",
                    );
                  },
                }),
              ]}
            >
              <Select
                allowClear
                showSearch
                loading={warehouseLoading || warehouseFetching}
                placeholder="Select to warehouse"
                optionFilterProp="label"
                options={warehouseOptions}
              />
            </AntdForm.Item>
          </div>

          <AntdForm.Item label="Note" name="note">
            <Input.TextArea rows={3} placeholder="Rebalancing stock" />
          </AntdForm.Item>

          <Card size="small" title="Transfer Items">
            <AntdForm.List name="items">
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
                      <StockTransferItemRow
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
                        requestedQuantity: 1,
                      })
                    }
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </AntdForm.List>
          </Card>

          <Space className="mt-4">
            <Button
            loading={createStockTransfer.isPending}
            type="primary" htmlType="submit" icon={<Save />}>
              Create Transfer
            </Button>

            <Button
              onClick={() =>
                router.push("/admin/dashboard/inventory/stock-transfers")
              }
            >
              Cancel
            </Button>
          </Space>
        </AntdForm>
      </Card>
    </div>
  );
}