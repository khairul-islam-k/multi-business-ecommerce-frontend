"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useProductsQuery } from "@/lib/api/hooks/product";
import { useProductVariantQuery } from "@/lib/api/hooks/product-variant";
import { useSuppliersQuery } from "@/lib/api/hooks/supplier";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { useAuthStore } from "@/stores/auth.store";
import { ResponseVariant } from "@/types/product/variant";

const { TextArea } = Input;

type PurchaseOrderStatus = "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";

type PurchaseOrderItemFormValue = {
  productId: string;
  variantId: string;
  quantityOrdered: number;
  unitCost: number;
  discountAmount: number;
  taxAmount: number;
};

type PurchaseOrderFormValues = {
  supplierId: string;
  warehouseId: string;
  orderDate: Dayjs;
  expectedDeliveryDate: Dayjs;
  status: PurchaseOrderStatus;
  shippingCost: number;
  note?: string;
  items: PurchaseOrderItemFormValue[];
};

type PurchaseOrderPayload = {
  supplierId: string;
  warehouseId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  shippingCost: number;
  note: string;
  items: PurchaseOrderItemFormValue[];
};

const toNumber = (value: string | number | null | undefined) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const PurchaseOrder = () => {
  const [form] = Form.useForm<PurchaseOrderFormValues>();
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [variantSearch, setVariantSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [variantMap, setVariantMap] = useState<
    Record<string, ResponseVariant[]>
  >({});

  const { data: suppliers, isLoading: supplierLoading } = useSuppliersQuery(
    businessId,
    {
      page: 1,
      limit: 50,
      search: "",
      status: "ACTIVE",
      sortOrder: "desc",
    },
  );

  const { data: warehouses, isLoading: warehouseLoading } = useWarehousesQuery(
    businessId,
    {
      page: 1,
      limit: 50,
      search: "",
      status: "ACTIVE",
      sortOrder: "desc",
    },
  );

  const {
    data: products,
    isLoading: productLoading,
    isFetching: productFetching,
  } = useProductsQuery(businessId, {
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const {
    data: variants = [],
    isLoading: variantLoading,
    isFetching: variantFetching,
  } = useProductVariantQuery(businessId, selectedProductId, variantSearch);

  useEffect(() => {
    if (!selectedProductId) return;

    setVariantMap((prev) => ({
      ...prev,
      [selectedProductId]: variants,
    }));
  }, [selectedProductId, variants]);

  const formItems = Form.useWatch("items", form) ?? [];
  const shippingCost = Form.useWatch("shippingCost", form) ?? 0;

  const supplierOptions = useMemo(() => {
    return (suppliers?.items ?? []).map((supplier) => ({
      label: supplier.name,
      value: supplier.id,
    }));
  }, [suppliers]);

  const warehouseOptions = useMemo(() => {
    return (warehouses?.items ?? []).map((warehouse) => ({
      label: warehouse.name,
      value: warehouse.id,
    }));
  }, [warehouses]);

  const productOptions = useMemo(() => {
    return (products?.items ?? []).map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }, [products]);

  const subtotal = formItems.reduce((sum, item) => {
    return (
      sum +
      toNumber(item?.quantityOrdered) * toNumber(item?.unitCost)
    );
  }, 0);

  const totalDiscount = formItems.reduce((sum, item) => {
    return sum + toNumber(item?.discountAmount);
  }, 0);

  const totalTax = formItems.reduce((sum, item) => {
    return sum + toNumber(item?.taxAmount);
  }, 0);

  const grandTotal = subtotal - totalDiscount + totalTax + toNumber(shippingCost);

  const handleProductChange = (index: number, productId: string) => {
    form.setFieldValue(["items", index, "productId"], productId);
    form.setFieldValue(["items", index, "variantId"], undefined);
    form.setFieldValue(["items", index, "unitCost"], 0);

    setSelectedProductId(productId);
    setVariantSearch("");
  };

  const handleVariantChange = (
    index: number,
    variantId: string,
    rowVariants: ResponseVariant[],
  ) => {
    const selectedVariant = rowVariants.find(
      (variant) => variant.id === variantId,
    );

    form.setFieldValue(["items", index, "variantId"], variantId);
    form.setFieldValue(
      ["items", index, "unitCost"],
      toNumber(selectedVariant?.price),
    );
  };

  const onFinish = async (values: PurchaseOrderFormValues) => {
    const payload: PurchaseOrderPayload = {
      supplierId: values.supplierId,
      warehouseId: values.warehouseId,
      orderDate: values.orderDate.toDate().toISOString(),
      expectedDeliveryDate: values.expectedDeliveryDate.toDate().toISOString(),
      status: values.status,
      shippingCost: toNumber(values.shippingCost),
      note: values.note?.trim() || "",
      items: values.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantityOrdered: toNumber(item.quantityOrdered),
        unitCost: toNumber(item.unitCost),
        discountAmount: toNumber(item.discountAmount),
        taxAmount: toNumber(item.taxAmount),
      })),
    };

    console.log("Purchase order payload:", payload);
    message.success("Payload is ready. Check console.");

    /**
     * API example:
     *
     * await createPurchaseOrder.mutateAsync(payload);
     * message.success("Purchase order created successfully");
     * router.push("/admin/dashboard/purchase-orders");
     */
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Create Purchase Order"
          subtitle="Create purchase order with supplier, warehouse, products, and variants."
          breadcrumb={adminBreadcrumb}
        />
      </div>

      <Form<PurchaseOrderFormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={true}
        initialValues={{
          status: "DRAFT",
          shippingCost: 0,
          items: [
            {
              productId: "",
              variantId: "",
              quantityOrdered: 1,
              unitCost: 0,
              discountAmount: 0,
              taxAmount: 0,
            },
          ],
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card style={{ marginBottom: "16px" }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="supplierId"
                    label="Supplier"
                    rules={[
                      {
                        required: true,
                        message: "Please select supplier",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select supplier"
                      loading={supplierLoading}
                      optionFilterProp="label"
                      options={supplierOptions}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="warehouseId"
                    label="Warehouse"
                    rules={[
                      {
                        required: true,
                        message: "Please select warehouse",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select warehouse"
                      loading={warehouseLoading}
                      optionFilterProp="label"
                      options={warehouseOptions}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="orderDate"
                    label="Order Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select order date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="expectedDeliveryDate"
                    label="Expected Delivery Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select expected delivery date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please select status",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select status"
                      options={[
                        { label: "Draft", value: "DRAFT" },
                        { label: "Ordered", value: "ORDERED" },
                        { label: "Received", value: "RECEIVED" },
                        { label: "Cancelled", value: "CANCELLED" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="shippingCost" label="Shipping Cost">
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="note" label="Note">
                    <TextArea rows={4} placeholder="Urgent purchase" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Line Items">
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    <Space direction="vertical" size={16} className="w-full">
                      {fields.map((field, index) => {
                        const currentItem = formItems?.[index];
                        const currentProductId = currentItem?.productId;

                        const rowVariants =
                          currentProductId === selectedProductId
                            ? variants
                            : variantMap[currentProductId] ?? [];

                        const variantOptions = rowVariants.map((variant) => ({
                          label: variant.title,
                          value: variant.id,
                        }));

                        const lineTotal =
                          toNumber(currentItem?.quantityOrdered) *
                            toNumber(currentItem?.unitCost) -
                          toNumber(currentItem?.discountAmount) +
                          toNumber(currentItem?.taxAmount);

                        return (
                          <Card
                            key={field.key}
                            size="small"
                            title={`Item ${index + 1}`}
                            extra={
                              <Button
                                danger
                                type="text"
                                disabled={fields.length === 1}
                                icon={<DeleteOutlined />}
                                onClick={() => remove(field.name)}
                              />
                            }
                          >
                            <Row gutter={12}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  name={[field.name, "productId"]}
                                  label="Product"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select product",
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    placeholder="Select product"
                                    loading={productLoading || productFetching}
                                    optionFilterProp="label"
                                    filterOption={false}
                                    options={productOptions}
                                    onChange={(productId) =>
                                      handleProductChange(index, productId)
                                    }
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  name={[field.name, "variantId"]}
                                  label="Variant"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select variant",
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    placeholder={
                                      currentProductId
                                        ? "Select variant"
                                        : "Select product first"
                                    }
                                    disabled={!currentProductId}
                                    loading={
                                      currentProductId === selectedProductId &&
                                      (variantLoading || variantFetching)
                                    }
                                    optionFilterProp="label"
                                    filterOption={false}
                                    options={variantOptions}
                                    onDropdownVisibleChange={(open) => {
                                      if (open && currentProductId) {
                                        setSelectedProductId(currentProductId);
                                        setVariantSearch("");
                                      }
                                    }}
                                    onSearch={(value) => {
                                      if (!currentProductId) return;

                                      setSelectedProductId(currentProductId);
                                      setVariantSearch(value);
                                    }}
                                    onChange={(variantId) =>
                                      handleVariantChange(
                                        index,
                                        variantId,
                                        rowVariants,
                                      )
                                    }
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  name={[field.name, "quantityOrdered"]}
                                  label="Quantity"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Quantity is required",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  name={[field.name, "unitCost"]}
                                  label="Unit Cost"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Unit cost is required",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  name={[field.name, "discountAmount"]}
                                  label="Discount"
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  name={[field.name, "taxAmount"]}
                                  label="Tax"
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={16}>
                                <Flex
                                  align="center"
                                  justify="end"
                                  style={{ height: "100%" }}
                                >
                                  <strong>Line Total: ৳ {lineTotal}</strong>
                                </Flex>
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                    </Space>

                    <Button
                      style={{ marginTop: 16 }}
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({
                          productId: "",
                          variantId: "",
                          quantityOrdered: 1,
                          unitCost: 0,
                          discountAmount: 0,
                          taxAmount: 0,
                        })
                      }
                    >
                      Add Item
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Summary">
              <Flex justify="space-between">
                <span>Subtotal</span>
                <strong>৳ {subtotal}</strong>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <Flex justify="space-between">
                <span>Discount</span>
                <strong>৳ {totalDiscount}</strong>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <Flex justify="space-between">
                <span>Tax</span>
                <strong>৳ {totalTax}</strong>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <Flex justify="space-between">
                <span>Shipping Cost</span>
                <strong>৳ {toNumber(shippingCost)}</strong>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <Flex justify="space-between">
                <strong>Total</strong>
                <strong>৳ {grandTotal}</strong>
              </Flex>

              <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block>
                  Create Purchase Order
                </Button>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PurchaseOrder;