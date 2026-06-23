"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { CreditCardOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useFinanceAccountQuery } from "@/lib/api/hooks/finance-account";
import {
  useCustomerQuery,
  useOrderMutations,
  useProductsQuery,
  useTaxQuery,
  useWarehousesQuery,
} from "@/lib/api";
import type { OrderPaymentPayload, OrderPayload } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";
import type { ResponseVariant } from "@/types/product/variant";

const { Text, Title } = Typography;

type OrderFormValues = Omit<OrderPayload, "items"> & {
  customerMode?: "existing" | "walk-in";
  items: Array<{
    productId?: string;
    variantId?: string;
    quantity?: number;
    discountAmount?: number;
  }>;
};

const trimOrUndefined = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toNumber = (value?: string | number | null) => Number(value ?? 0);

const getVariantLabel = (variant: ResponseVariant) => {
  const attributes = variant.attributes
    ?.map((item) => item.attributeValue?.value)
    .filter(Boolean)
    .join(" / ");

  return attributes
    ? `${variant.title || variant.sku || "Variant"} - ${attributes}`
    : variant.title || variant.sku || "Variant";
};

const getVariantPrice = (variant: ResponseVariant | undefined) =>
  toNumber(variant?.effectivePrice ?? variant?.priceOverride);

const money = (value: number) => `BDT ${value.toLocaleString()}`;

export default function CreateOrder() {
  const [form] = Form.useForm<OrderFormValues>();
  const [paymentForm] = Form.useForm<OrderPaymentPayload>();
  const router = useRouter();
  const { message } = App.useApp();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentValues, setPaymentValues] = useState<OrderPaymentPayload>();
  const businessId = useActiveBusinessId();
  const products = useProductsQuery(businessId ?? "", { page: 1, limit: 100 });
  const customers = useCustomerQuery(businessId ?? "", { page: 1, limit: 100 });
  const warehouses = useWarehousesQuery(businessId ?? "", {
    page: 1,
    limit: 100,
  });
  const taxes = useTaxQuery(businessId ?? "", { page: 1, limit: 100 });
  const accounts = useFinanceAccountQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });
  const mutations = useOrderMutations(businessId ?? "");
  const watchedItems = Form.useWatch("items", form);
  const customerMode = Form.useWatch("customerMode", form) ?? "walk-in";
  const shippingCharge = Form.useWatch("shippingCharge", form);
  const orderItems = useMemo(() => watchedItems ?? [], [watchedItems]);

  const productItems = useMemo(() => products.data?.items ?? [], [products.data?.items]);

  const productOptions = useMemo(
    () =>
      productItems.map((product) => ({
        label: product.name,
        value: product.id,
      })),
    [productItems],
  );

  const getVariantOptions = (productId?: string) =>
    productItems
      .find((product) => product.id === productId)
      ?.variants?.map((variant) => ({
        label: getVariantLabel(variant),
        value: variant.id,
      })) ?? [];

  const totals = useMemo(() => {
    const subtotal = orderItems.reduce((total, item) => {
      const product = productItems.find((entry) => entry.id === item?.productId);
      if (!product) return total;

      const variant = product.variants?.find(
        (entry) => entry.id === item?.variantId,
      );
      const unitPrice = variant ? getVariantPrice(variant) : toNumber(product.price);

      return total + unitPrice * toNumber(item?.quantity);
    }, 0);
    const discountTotal = orderItems.reduce(
      (total, item) => total + toNumber(item?.discountAmount),
      0,
    );
    const taxTotal = orderItems.reduce((total, item) => {
      const product = productItems.find((entry) => entry.id === item?.productId);
      if (!product) return total;

      const selectedTax = taxes.data?.items?.find(
        (tax) => tax.id === product.taxId,
      );
      const taxRate = toNumber(selectedTax?.rate);
      const variant = product.variants?.find(
        (entry) => entry.id === item?.variantId,
      );
      const unitPrice = variant ? getVariantPrice(variant) : toNumber(product.price);
      const lineSubtotal = unitPrice * toNumber(item?.quantity);
      const lineTaxableAmount = Math.max(
        lineSubtotal - toNumber(item?.discountAmount),
        0,
      );

      return total + lineTaxableAmount * (taxRate / 100);
    }, 0);
    const taxableAmount = Math.max(subtotal - discountTotal, 0);
    const shipping = toNumber(shippingCharge);

    return {
      subtotal,
      discountTotal,
      taxTotal,
      shipping,
      total: taxableAmount + taxTotal + shipping,
    };
  }, [orderItems, productItems, shippingCharge, taxes.data?.items]);

  const onFinish = async (values: OrderFormValues) => {
    if (!businessId) return;

    const items = values.items
      .filter((item) => item.productId && item.quantity)
      .map((item) => ({
        productId: item.productId as string,
        variantId: item.variantId || undefined,
        quantity: Number(item.quantity),
        discountAmount: Number(item.discountAmount ?? 0),
      }));

    if (!items.length) {
      message.error("Add at least one order item.");
      return;
    }

    const resolvedCustomerMode = values.customerMode ?? "walk-in";

    if (resolvedCustomerMode === "existing" && !values.customerId) {
      message.error("Select an existing customer.");
      return;
    }

    try {
      const payload: OrderPayload = {
        customerId:
          resolvedCustomerMode === "existing" ? values.customerId : undefined,
        warehouseId: values.warehouseId,
        payment: paymentValues,
        orderType: values.orderType ?? "ADMIN",
        orderSource: values.orderSource ?? "ADMIN_PANEL",
        customerName:
          resolvedCustomerMode === "walk-in"
            ? trimOrUndefined(values.customerName)
            : undefined,
        customerPhone:
          resolvedCustomerMode === "walk-in"
            ? trimOrUndefined(values.customerPhone)
            : undefined,
        customerEmail:
          resolvedCustomerMode === "walk-in"
            ? trimOrUndefined(values.customerEmail)
            : undefined,
        shippingCharge: Number(values.shippingCharge ?? 0),
        note: trimOrUndefined(values.note),
        isCod: Boolean(values.isCod),
        items,
      };

      await mutations.createOrder.mutateAsync(payload);
      message.success("Order created.");
      router.push("/admin/dashboard/orders");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const openPaymentModal = () => {
    if (paymentValues) {
      paymentForm.setFieldsValue(paymentValues);
    } else {
      paymentForm.resetFields();
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalOk = async () => {
    const values = await paymentForm.validateFields();
    setPaymentValues(values);
    setIsPaymentModalOpen(false);
    message.success("Payment details added to this order.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Order" breadcrumb={adminBreadcrumb} />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          customerMode: "walk-in",
          orderType: "ADMIN",
          orderSource: "ADMIN_PANEL",
          shippingCharge: 0,
          isCod: false,
          items: [{ quantity: 1, discountAmount: 0 }],
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Order Details">
              <Row gutter={12}>
                <Col xs={24}>
                  <Form.Item name="customerMode" label="Customer">
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      onChange={() =>
                        form.setFieldsValue({
                          customerId: undefined,
                          customerName: undefined,
                          customerPhone: undefined,
                          customerEmail: undefined,
                        })
                      }
                      options={[
                        { label: "Walk-in", value: "walk-in" },
                        { label: "Existing customer", value: "existing" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                {customerMode === "existing" ? (
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="customerId"
                      label="Customer"
                      rules={[{ required: true }]}
                    >
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select customer"
                        options={(customers.data?.items ?? []).map((customer) => ({
                          label: `${customer.name}${customer.phone ? ` (${customer.phone})` : ""}`,
                          value: customer.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item name="customerName" label="Walk-in customer name">
                        <Input maxLength={150} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="customerPhone" label="Customer phone">
                        <Input maxLength={30} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="customerEmail" label="Customer email">
                        <Input maxLength={150} />
                      </Form.Item>
                    </Col>
                  </>
                )}

                <Col xs={24} md={12}>
                  <Form.Item name="warehouseId" label="Warehouse">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      placeholder="Select warehouse"
                      options={(warehouses.data?.items ?? []).map((warehouse) => ({
                        label: warehouse.name,
                        value: warehouse.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="note" label="Note">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Items" className="mt-4">
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" className="w-full" size={12}>
                    {fields.map((field) => (
                      <Row gutter={12} key={field.key} align="middle">
                        <Col xs={24} md={8}>
                          <Form.Item
                            {...field}
                            name={[field.name, "productId"]}
                            label="Product"
                            rules={[{ required: true }]}
                          >
                            <Select
                              showSearch
                              optionFilterProp="label"
                              options={productOptions}
                              onChange={() =>
                                form.setFieldValue(
                                  ["items", field.name, "variantId"],
                                  undefined,
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, "variantId"]}
                            label="Variant"
                          >
                            <Select
                              allowClear
                              showSearch
                              optionFilterProp="label"
                              placeholder="No variant"
                              disabled={
                                !orderItems[field.name]?.productId ||
                                getVariantOptions(
                                  orderItems[field.name]?.productId,
                                ).length === 0
                              }
                              options={getVariantOptions(
                                orderItems[field.name]?.productId,
                              )}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item
                            {...field}
                            name={[field.name, "quantity"]}
                            label="Quantity"
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={0.001} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item
                            {...field}
                            name={[field.name, "discountAmount"]}
                            label="Discount"
                          >
                            <InputNumber min={0} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={2}>
                          <Button
                            danger
                            title="Remove item"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={() => add()}>
                      Add item
                    </Button>
                  </Space>
                )}
              </Form.List>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Charges">
              <Form.Item name="shippingCharge" label="Shipping charge">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Divider className="my-3" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text type="secondary">Subtotal</Text>
                  <Text>{money(totals.subtotal)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Discount</Text>
                  <Text>{money(totals.discountTotal)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Product tax estimate</Text>
                  <Text>{money(totals.taxTotal)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Shipping</Text>
                  <Text>{money(totals.shipping)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Title level={5} className="m-0">
                    Total
                  </Title>
                  <Title level={5} className="m-0">
                    {money(totals.total)}
                  </Title>
                </div>
              </div>

              <Button
                className="mt-4"
                block
                icon={<CreditCardOutlined />}
                onClick={openPaymentModal}
              >
                {paymentValues ? "Edit payment details" : "Add payment details"}
              </Button>

              {paymentValues && (
                <div className="mt-2 text-xs text-gray-500">
                  {paymentValues.paymentMethod} payment will be attached.
                </div>
              )}

              <Button
                className="mt-4"
                type="primary"
                block
                htmlType="submit"
                loading={mutations.createOrder.isPending}
              >
                Create order
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal
        title="Order payment"
        open={isPaymentModalOpen}
        okText="Save payment"
        onOk={handlePaymentModalOk}
        onCancel={() => setIsPaymentModalOpen(false)}
        destroyOnHidden
      >
        <Form form={paymentForm} layout="vertical" className="mt-4">
          <Form.Item
            name="paymentMethod"
            label="Payment method"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select method"
              options={[
                "CASH",
                "COD",
                "BKASH",
                "NAGAD",
                "CARD",
                "BANK_TRANSFER",
                "OTHER",
              ].map((method) => ({ label: method, value: method }))}
            />
          </Form.Item>

          <Form.Item
            name="financeAccountId"
            label="Finance account"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select finance account"
              options={(accounts.data?.items ?? []).map((account) => ({
                label: `${account.name} (${account.accountType})`,
                value: account.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
