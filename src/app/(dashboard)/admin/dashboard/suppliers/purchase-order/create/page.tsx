"use client";

import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductVariantQuery } from "@/lib/api/hooks/product-variant";
import { usePurchaseOrderMutation } from "@/lib/api/hooks/purchase-order";
import { useSuppliersQuery } from "@/lib/api/hooks/supplier";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { PurchaseOrderPayload } from "@/types/suppliers/purchase-order";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { TextArea } = Input;

type PurchaseOrderStatus = "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";

type PurchaseOrderItemFormValue = {
  productId?: string;
  variantId?: string;
  quantityOrdered: number;
  unitCost: number;
  discountAmount: number;
};

type PurchaseOrderFormValues = {
  supplierId?: string;
  warehouseId?: string;
  expectedDeliveryDate?: Dayjs;
  status?: PurchaseOrderStatus;
  shippingCost?: number;
  note?: string;
  items: PurchaseOrderItemFormValue[];
};


type PurchaseOrderItemProps = {
  fieldName: number;
  remove: (index: number | number[]) => void;
  canRemove: boolean;
  businessId: string;
  form: ReturnType<typeof Form.useForm<PurchaseOrderFormValues>>[0];
  productOptions: {
    label: string;
    value: string;
  }[];
  productLoading: boolean;
};

const PurchaseOrderItem = ({
  fieldName,
  remove,
  canRemove,
  businessId,
  form,
  productOptions,
  productLoading,
}: PurchaseOrderItemProps) => {
  const productId = Form.useWatch(["items", fieldName, "productId"], form);

  const { data: variants = [], isLoading: variantLoading } =
    useProductVariantQuery(businessId, productId || "", "");

  return (
    <Card
      size="small"
      title={`Item ${fieldName + 1}`}
      extra={
        canRemove && (
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => remove(fieldName)}
          />
        )
      }
    >
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Form.Item
          label="Product"
          name={[fieldName, "productId"]}
          rules={[{ required: true, message: "Product is required" }]}
        >
          <Select
            showSearch
            placeholder="Select product"
            loading={productLoading}
            optionFilterProp="label"
            options={productOptions}
            onChange={() => {
              form.setFieldValue(["items", fieldName, "variantId"], undefined);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Variant"
          name={[fieldName, "variantId"]}
        >
          <Select
            showSearch
            disabled={!productId}
            placeholder="Select variant"
            loading={variantLoading}
            optionFilterProp="label"
            options={variants.map((variant) => ({
              label: variant.title,
              value: variant.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Quantity Ordered"
          name={[fieldName, "quantityOrdered"]}
          rules={[{ required: true, message: "Quantity is required" }]}
        >
          <InputNumber
            style={{
              width: '100%'
            }}
            min={1} />
        </Form.Item>

        <Form.Item
          label="Unit Cost"
          name={[fieldName, "unitCost"]}
          rules={[{ required: true, message: "Unit cost is required" }]}
        >
          <InputNumber min={0} 
          style={{
              width: '100%'
            }} />
        </Form.Item>

        <Form.Item label="Discount Amount" name={[fieldName, "discountAmount"]}>
          <InputNumber min={0} 
          style={{
              width: '100%'
            }} />
        </Form.Item>
      </div>
    </Card>
  );
};

const PurchaseOrderForm = () => {
  const [form] = Form.useForm<PurchaseOrderFormValues>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { message } = App.useApp();
  const router = useRouter();

  const {createPurchaseOrder} = usePurchaseOrderMutation(businessId);

  const { data: suppliers, isLoading: supplierLoading } = useSuppliersQuery(
    businessId,
    {
      status: "ACTIVE",
      sortOrder: "desc",
    }
  );

  const { data: warehouses, isLoading: warehouseLoading } = useWarehousesQuery(
    businessId,
    {
      status: "ACTIVE",
      sortOrder: "desc",
    }
  );

  const { data: products, isLoading: productLoading } = useProductsQuery(
    businessId,
    {
      status: "ACTIVE",
      sortOrder: "desc",
    }
  );

  const handleFinish = async (values: PurchaseOrderFormValues) => {
    if (
      !values.supplierId ||
      !values.warehouseId
    ) {
      return;
    }

    setIsSubmitting(true);
    const payload: PurchaseOrderPayload = {
      supplierId: values.supplierId,
      warehouseId: values.warehouseId,
      expectedDeliveryDate: values.expectedDeliveryDate?.toDate().toISOString(),
      status: values.status,
      shippingCost: Number(values.shippingCost ?? 0),
      note: values.note?.trim() || undefined,
      items: values.items.map((item) => ({
        productId: item.productId as string,
        variantId: item.variantId || undefined,
        quantityOrdered: Number(item.quantityOrdered),
        unitCost: Number(item.unitCost),
        discountAmount: Number(item.discountAmount ?? 0),
      })),
    };

    try {
      await createPurchaseOrder.mutateAsync(payload);
      router.push("/admin/dashboard/suppliers/purchase-order")
      message.success("Purchase Order created successfully");
      
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <Card title="Create Purchase Order">
      <Form<PurchaseOrderFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          status: "DRAFT",
          shippingCost: 0,
          note: "",
          items: [
            {
              productId: undefined,
              variantId: undefined,
              quantityOrdered: 1,
              unitCost: 0,
              discountAmount: 0,
            },
          ],
        }}
      >
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            label="Supplier"
            name="supplierId"
            rules={[{ required: true, message: "Supplier is required" }]}
          >
            <Select
              showSearch
              placeholder="Select supplier"
              loading={supplierLoading}
              optionFilterProp="label"
              options={(suppliers?.items ?? []).map((supplier) => ({
                label: supplier.name,
                value: supplier.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Warehouse"
            name="warehouseId"
            rules={[{ required: true, message: "Warehouse is required" }]}
          >
            <Select
              showSearch
              placeholder="Select warehouse"
              loading={warehouseLoading}
              optionFilterProp="label"
              options={(warehouses?.items ?? []).map((warehouse) => ({
                label: warehouse.name,
                value: warehouse.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Expected Delivery Date" name="expectedDeliveryDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select status"
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Ordered", value: "ORDERED" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Shipping Cost" name="shippingCost">
            <InputNumber min={0}
              style={{
                width: '100%'
              }}
            />
          </Form.Item>

          <Form.Item label="Note" name="note" className="md:col-span-2">
            <TextArea rows={3} placeholder="Urgent purchase" />
          </Form.Item>
        </div>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map((field) => (
                <PurchaseOrderItem
                  key={field.key}
                  fieldName={field.name}
                  remove={remove}
                  canRemove={fields.length > 1}
                  businessId={businessId}
                  form={form}
                  productLoading={productLoading}
                  productOptions={(products?.items ?? []).map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                />
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                block
                onClick={() =>
                  add({
                    productId: undefined,
                    variantId: undefined,
                    quantityOrdered: 1,
                    unitCost: 0,
                    discountAmount: 0,
                  })
                }
              >
                Add Item
              </Button>
            </div>
          )}
        </Form.List>

        <Space className="mt-6">
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Create Purchase Order
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default PurchaseOrderForm;
